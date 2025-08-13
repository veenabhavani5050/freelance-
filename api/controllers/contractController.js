// controllers/contractController.js
import Contract from '../models/Contract.js';
import User from '../models/User.js';
import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';

/**
 * NOTE:
 * - paymentService.releaseEscrow(contractId, milestoneIndex) is a placeholder
 *   where you should call your payment provider (Stripe/Razorpay) to release funds.
 * - notify(userId, payload) is a placeholder for sending notifications (email / socket / push).
 * Implement these services in /services and import them here.
 */
const paymentService = {
  // placeholder: implement real payment integration
  async releaseEscrow(contractId, milestoneIndex) {
    // simulate releasing escrow
    return { success: true, providerReference: `tx_${Date.now()}` };
  }
};

const notify = async (userId, payload) => {
  // placeholder: send socket/email/push
  // e.g. socket.to(userId).emit('notification', payload)
  return true;
};

// Allowed transitions map: current -> [allowed next statuses]
const STATUS_TRANSITIONS = {
  pending: ['accepted', 'cancelled'],
  accepted: ['in_progress', 'cancelled'],
  in_progress: ['completed', 'cancelled'],
  completed: [], // terminal
  cancelled: [] // terminal
};

// Helper: validate ObjectId
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

export const createContract = asyncHandler(async (req, res) => {
  const { freelancerId, service, job, title, description, milestones, deadline } = req.body;

  if (req.user.role !== 'client') {
    res.status(403);
    throw new Error('Only clients can create contracts');
  }

  if (!isValidId(freelancerId)) {
    res.status(400);
    throw new Error('Invalid freelancer id');
  }

  const freelancer = await User.findById(freelancerId);
  if (!freelancer || freelancer.role !== 'freelancer') {
    res.status(404);
    throw new Error('Freelancer not found');
  }

  if (!Array.isArray(milestones) || milestones.length === 0) {
    res.status(400);
    throw new Error('Milestones are required and must be a non-empty array');
  }

  // basic milestones validation
  for (const [i, m] of milestones.entries()) {
    if (!m.title || typeof m.amount !== 'number' || m.amount <= 0) {
      res.status(400);
      throw new Error(`Invalid milestone at index ${i}: title and positive amount required`);
    }
    // Normalize dueDate if provided
    if (m.dueDate) m.dueDate = new Date(m.dueDate);
  }

  const totalAmount = milestones.reduce((sum, m) => sum + Number(m.amount || 0), 0);

  const contract = await Contract.create({
    client: req.user._id,
    freelancer: freelancerId,
    service,
    job,
    title,
    description,
    milestones,
    deadline,
    totalAmount,
    status: 'pending'
  });

  // Notify freelancer of new contract
  notify(freelancerId, {
    type: 'contract_created',
    contractId: contract._id,
    title: contract.title
  }).catch(() => { /* swallow notify errors */ });

  res.status(201).json(contract);
});

export const getMyContracts = asyncHandler(async (req, res) => {
  // pagination + filtering
  const page = Number(req.query.page) || 1;
  const limit = Math.min(Number(req.query.limit) || 20, 100);
  const statusFilter = req.query.status;
  const skip = (page - 1) * limit;

  const filter = {
    $or: [{ client: req.user._id }, { freelancer: req.user._id }],
    isDeleted: false
  };
  if (statusFilter) filter.status = statusFilter;

  const total = await Contract.countDocuments(filter);
  const contracts = await Contract.find(filter)
    .populate('client', 'name email')
    .populate('freelancer', 'name email')
    .populate('service')
    .populate('job')
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit);

  res.json({
    data: contracts,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit)
    }
  });
});

export const updateContractStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, cancelReason } = req.body;

  if (!isValidId(id)) {
    res.status(400);
    throw new Error('Invalid contract id');
  }

  const contract = await Contract.findById(id);
  if (!contract) {
    res.status(404);
    throw new Error('Contract not found');
  }

  const currentUserId = req.user._id.toString();
  if (![contract.client.toString(), contract.freelancer.toString()].includes(currentUserId)) {
    res.status(403);
    throw new Error('Not authorized to update this contract');
  }

  if (!status || !Object.keys(STATUS_TRANSITIONS).includes(status)) {
    res.status(400);
    throw new Error('Invalid status value');
  }

  // enforce allowed transitions
  const allowed = STATUS_TRANSITIONS[contract.status] || [];
  if (!allowed.includes(status)) {
    res.status(400);
    throw new Error(`Invalid status transition from "${contract.status}" to "${status}"`);
  }

  // Business rule: only client can accept a pending contract
  if (status === 'accepted' && req.user.role !== 'client') {
    res.status(403);
    throw new Error('Only the client can accept the contract');
  }

  // If moving to cancelled, capture reason
  if (status === 'cancelled') {
    contract.cancelReason = cancelReason || 'Cancelled by user';
  }

  contract.status = status;
  await contract.save();

  // notify other party
  const otherUserId = contract.client.toString() === currentUserId ? contract.freelancer : contract.client;
  notify(otherUserId, {
    type: 'contract_status_updated',
    contractId: contract._id,
    status
  }).catch(() => {});

  res.json({ message: 'Contract status updated', contract });
});

/**
 * Endpoint: freelancer marks milestone completed (logical completion).
 * Client still needs to approve/payout (approveMilestone).
 */
export const completeMilestone = asyncHandler(async (req, res) => {
  const { id, milestoneIndex } = req.params;

  if (!isValidId(id)) {
    res.status(400);
    throw new Error('Invalid contract id');
  }

  const idx = Number(milestoneIndex);
  if (Number.isNaN(idx)) {
    res.status(400);
    throw new Error('Invalid milestone index');
  }

  const contract = await Contract.findById(id);
  if (!contract) {
    res.status(404);
    throw new Error('Contract not found');
  }

  if (contract.freelancer.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Only the freelancer can mark milestones as completed');
  }

  const milestone = contract.milestones[idx];
  if (!milestone) {
    res.status(404);
    throw new Error('Milestone not found');
  }

  if (milestone.isCompleted) {
    res.status(400);
    throw new Error('Milestone already marked completed');
  }

  milestone.isCompleted = true;
  await contract.save();

  // notify client to approve and release payment
  notify(contract.client, {
    type: 'milestone_completed',
    contractId: contract._id,
    milestoneIndex: idx
  }).catch(() => {});

  res.json({ message: 'Milestone marked completed', contract });
});

/**
 * Client approves a completed milestone and triggers payment release.
 * This is where payment integration should be called.
 */
export const approveMilestone = asyncHandler(async (req, res) => {
  const { id, milestoneIndex } = req.params;

  if (!isValidId(id)) {
    res.status(400);
    throw new Error('Invalid contract id');
  }
  const idx = Number(milestoneIndex);
  if (Number.isNaN(idx)) {
    res.status(400);
    throw new Error('Invalid milestone index');
  }

  const contract = await Contract.findById(id);
  if (!contract) {
    res.status(404);
    throw new Error('Contract not found');
  }

  if (contract.client.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Only the client can approve and pay milestones');
  }

  const milestone = contract.milestones[idx];
  if (!milestone) {
    res.status(404);
    throw new Error('Milestone not found');
  }

  if (!milestone.isCompleted) {
    res.status(400);
    throw new Error('Milestone must be marked completed by freelancer before approval');
  }

  if (milestone.isPaid) {
    res.status(400);
    throw new Error('Milestone is already paid');
  }

  // Mark as paid (call payment provider)
  const paymentResult = await paymentService.releaseEscrow(contract._id.toString(), idx);

  if (!paymentResult || !paymentResult.success) {
    res.status(500);
    throw new Error('Payment release failed');
  }

  milestone.isPaid = true;
  milestone.paymentDate = new Date();
  milestone.escrowed = false;
  // optionally store provider reference
  milestone.paymentRef = paymentResult.providerReference || null;

  // if all milestones paid & completed -> mark contract completed
  const allCompletedPaid = contract.milestones.every((m) => m.isCompleted && m.isPaid);
  if (allCompletedPaid) contract.status = 'completed';

  await contract.save();

  notify(contract.freelancer, {
    type: 'milestone_paid',
    contractId: contract._id,
    milestoneIndex: idx,
    paymentRef: paymentResult.providerReference
  }).catch(() => {});

  res.json({ message: 'Milestone approved and paid', contract });
});

export const updateMilestone = asyncHandler(async (req, res) => {
  const { id, milestoneIndex } = req.params;
  const { title, description, amount, dueDate } = req.body;

  if (!isValidId(id)) {
    res.status(400);
    throw new Error('Invalid contract id');
  }
  const idx = Number(milestoneIndex);
  if (Number.isNaN(idx)) {
    res.status(400);
    throw new Error('Invalid milestone index');
  }

  const contract = await Contract.findById(id);
  if (!contract) {
    res.status(404);
    throw new Error('Contract not found');
  }

  if (contract.client.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Only the client can update milestones');
  }

  const milestone = contract.milestones[idx];
  if (!milestone) {
    res.status(404);
    throw new Error('Milestone not found');
  }

  // Prevent editing completed or paid milestones
  if (milestone.isPaid || milestone.isCompleted) {
    res.status(400);
    throw new Error('Cannot edit a milestone that is completed or already paid');
  }

  if (title) milestone.title = title;
  if (description) milestone.description = description;
  if (amount !== undefined) {
    if (typeof amount !== 'number' || amount <= 0) {
      res.status(400);
      throw new Error('Milestone amount must be a positive number');
    }
    milestone.amount = amount;
  }
  if (dueDate) milestone.dueDate = new Date(dueDate);

  // Recalculate total amount
  contract.totalAmount = contract.milestones.reduce((sum, m) => sum + Number(m.amount || 0), 0);

  await contract.save();

  notify(contract.freelancer, {
    type: 'milestone_updated',
    contractId: contract._id,
    milestoneIndex: idx
  }).catch(() => {});

  res.json({ message: 'Milestone updated', contract });
});

export const deleteContract = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!isValidId(id)) {
    res.status(400);
    throw new Error('Invalid contract id');
  }

  const contract = await Contract.findById(id);
  if (!contract) {
    res.status(404);
    throw new Error('Contract not found');
  }

  if (![contract.client.toString(), contract.freelancer.toString()].includes(req.user._id.toString())) {
    res.status(403);
    throw new Error('Not authorized to delete this contract');
  }

  // Soft delete - keep record for audit
  contract.isDeleted = true;
  await contract.save();

  notify(contract.client, {
    type: 'contract_deleted',
    contractId: contract._id
  }).catch(() => {});

  res.json({ message: 'Contract deleted (soft)' });
});
