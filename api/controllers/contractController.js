// controllers/contractController.js
import Contract from '../models/Contract.js';
import Review from '../models/Review.js';
import User from '../models/User.js';
import Service from '../models/Service.js';
import Job from '../models/Job.js';
import mongoose from 'mongoose';

// ----------------------
// Create new contract
// ----------------------
export const createContract = async (req, res) => {
  try {
    const { freelancer, service, job, title, description, milestones, deadline } = req.body;

    if (req.user.role !== 'client') {
      return res.status(403).json({ message: 'Only clients can create contracts' });
    }

    const contract = new Contract({
      client: req.user._id,
      freelancer,
      service: service || null,
      job: job || null,
      title,
      description,
      milestones,
      deadline,
    });

    await contract.save();
    res.status(201).json(contract);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ----------------------
// Get all my contracts
// ----------------------
export const getMyContracts = async (req, res) => {
  try {
    const filter = req.user.role === 'client'
      ? { client: req.user._id, isDeleted: false }
      : { freelancer: req.user._id, isDeleted: false };

    const contracts = await Contract.find(filter)
      .populate('client', 'name email')
      .populate('freelancer', 'name email')
      .populate('service', 'title')
      .populate('job', 'title');

    res.json(contracts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ----------------------
// Get single contract
// ----------------------
export const getContractById = async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.id)
      .populate('client', 'name email')
      .populate('freelancer', 'name email')
      .populate('service', 'title')
      .populate('job', 'title');

    if (!contract) return res.status(404).json({ message: 'Contract not found' });

    // Authorization check: Only the client or freelancer on the contract can view it.
    // This is the code that is correctly returning the 403 Forbidden error you're seeing.
    if (
      contract.client.toString() !== req.user._id.toString() &&
      contract.freelancer.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(contract);
  } catch (error) {
    // Catch-all for database errors or invalid IDs
    res.status(500).json({ message: error.message });
  }
};

// ----------------------
// Update contract status
// ----------------------
export const updateContractStatus = async (req, res) => {
  try {
    const { status, cancelReason } = req.body;
    const contract = await Contract.findById(req.params.id);

    if (!contract) return res.status(404).json({ message: 'Contract not found' });

    // Authorization
    if (
      contract.client.toString() !== req.user._id.toString() &&
      contract.freelancer.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Role rules
    if (status === 'accepted' && req.user.role !== 'freelancer') {
      return res.status(403).json({ message: 'Only freelancer can accept contract' });
    }
    if (status === 'cancelled' && req.user.role !== 'client') {
      return res.status(403).json({ message: 'Only client can cancel contract' });
    }

    contract.status = status;
    if (status === 'cancelled') contract.cancelReason = cancelReason || 'Cancelled by client';
    await contract.save();

    res.json(contract);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ----------------------
// Complete a milestone (freelancer marks as done)
// ----------------------
export const completeMilestone = async (req, res) => {
  try {
    const { id, milestoneIndex } = req.params;
    const contract = await Contract.findById(id);

    if (!contract) return res.status(404).json({ message: 'Contract not found' });

    if (contract.freelancer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only freelancer can mark milestone complete' });
    }

    const milestone = contract.milestones[milestoneIndex];
    if (!milestone) return res.status(404).json({ message: 'Milestone not found' });

    milestone.isCompleted = true;
    await contract.save();

    res.json(contract);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ----------------------
// Approve milestone (client approves & triggers payment)
// ----------------------
export const approveMilestone = async (req, res) => {
  try {
    const { id, milestoneIndex } = req.params;
    const contract = await Contract.findById(id);

    if (!contract) return res.status(404).json({ message: 'Contract not found' });

    if (contract.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only client can approve milestone' });
    }

    const milestone = contract.milestones[milestoneIndex];
    if (!milestone) return res.status(404).json({ message: 'Milestone not found' });

    if (!milestone.isCompleted) {
      return res.status(400).json({ message: 'Freelancer has not marked this milestone as complete yet' });
    }

    milestone.isPaid = true;
    milestone.paymentDate = Date.now();
    milestone.paymentRef = `PAY-${Date.now()}`;

    await contract.save();

    res.json({ message: 'Milestone approved and payment released', contract });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ----------------------
// Update milestone (client only)
// ----------------------
export const updateMilestone = async (req, res) => {
  try {
    const { id, milestoneIndex } = req.params;
    const { title, description, amount, dueDate } = req.body;

    const contract = await Contract.findById(id);
    if (!contract) return res.status(404).json({ message: 'Contract not found' });

    if (contract.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only client can update milestone' });
    }

    const milestone = contract.milestones[milestoneIndex];
    if (!milestone) return res.status(404).json({ message: 'Milestone not found' });

    if (title) milestone.title = title;
    if (description) milestone.description = description;
    if (amount) milestone.amount = amount;
    if (dueDate) milestone.dueDate = dueDate;

    await contract.save();
    res.json(contract);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ----------------------
// Delete contract (soft delete)
// ----------------------
export const deleteContract = async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.id);
    if (!contract) return res.status(404).json({ message: 'Contract not found' });

    if (
      contract.client.toString() !== req.user._id.toString() &&
      contract.freelancer.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    contract.isDeleted = true;
    await contract.save();

    res.json({ message: 'Contract deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ----------------------
// Create review (after contract completed)
// ----------------------
export const createReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    const contract = await Contract.findById(id);
    if (!contract) return res.status(404).json({ message: 'Contract not found' });

    if (contract.status !== 'completed') {
      return res.status(400).json({ message: 'Can only review completed contracts' });
    }

    // Client reviews freelancer
    if (req.user.role === 'client') {
      const review = new Review({
        reviewer: req.user._id,
        reviewee: contract.freelancer,
        contract: contract._id,
        rating,
        comment,
      });
      await review.save();
      return res.json(review);
    }

    // Freelancer reviews client
    if (req.user.role === 'freelancer') {
      const review = new Review({
        reviewer: req.user._id,
        reviewee: contract.client,
        contract: contract._id,
        rating,
        comment,
      });
      await review.save();
      return res.json(review);
    }

    res.status(403).json({ message: 'Not authorized to review' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};