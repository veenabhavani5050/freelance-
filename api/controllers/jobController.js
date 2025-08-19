import Job from '../models/Job.js';
import Notification from '../models/Notification.js'; // Import the Notification model
import asyncHandler from 'express-async-handler';
import { body, validationResult } from 'express-validator';

// ----------------- CLIENT JOB CONTROLLERS -----------------

// Validation middleware for job creation and update
const jobValidation = [
    body('title').notEmpty().withMessage('Title is required').trim().escape(),
    body('description').notEmpty().withMessage('Description is required').trim(),
    body('skillsRequired').isArray().withMessage('Skills must be an array'),
    body('paymentType').isIn(['fixed', 'hourly']).withMessage('Invalid payment type'),
    body('jobType').isIn(['remote', 'hybrid', 'on-site']).withMessage('Invalid job type'),
    body('category').notEmpty().withMessage('Category is required').trim(),
    body('budget.min').isNumeric().withMessage('Minimum budget must be a number'),
    body('budget.max').isNumeric().withMessage('Maximum budget must be a number'),
    body('deadline').isISO8601().toDate().withMessage('Invalid deadline date format'),
];

export const createJob = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {
        title,
        description,
        skillsRequired,
        budget,
        paymentType,
        jobType,
        deadline,
        category,
        location,
        attachments,
        companyName,
        estimatedDuration
    } = req.body;

    const job = new Job({
        client: req.user._id,
        title,
        description,
        skillsRequired,
        budget,
        paymentType,
        jobType,
        deadline,
        category,
        location,
        attachments,
        companyName,
        estimatedDuration,
        proposalsCount: 0,
    });

    const savedJob = await job.save();
    res.status(201).json(savedJob);
});

export const updateJob = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const {
        title,
        description,
        skillsRequired,
        budget,
        paymentType,
        jobType,
        deadline,
        category,
        location,
        attachments,
        companyName,
        estimatedDuration
    } = req.body;

    const job = await Job.findOneAndUpdate(
        { _id: id, client: req.user._id },
        {
            title,
            description,
            skillsRequired,
            budget,
            paymentType,
            jobType,
            deadline,
            category,
            location,
            attachments,
            companyName,
            estimatedDuration
        },
        { new: true, runValidators: true }
    );

    if (!job) {
        res.status(404);
        throw new Error('Job not found or not authorized');
    }

    res.json(job);
});

export const deleteJob = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const job = await Job.findOneAndDelete({ _id: id, client: req.user._id });

    if (!job) {
        res.status(404);
        throw new Error('Job not found or not authorized');
    }

    res.json({ message: 'Job deleted successfully' });
});

export const getMyJobs = asyncHandler(async (req, res) => {
    const jobs = await Job.find({ client: req.user._id })
        .populate('proposals.freelancer', 'name email avatar skills');
    res.status(200).json(jobs);
});

// ----------------- FREELANCER & PUBLIC JOB CONTROLLERS -----------------

export const getAllJobs = asyncHandler(async (req, res) => {
    const { skills, minBudget, maxBudget, category, type, status, location } = req.query;
    const filter = {};

    if (skills) filter.skillsRequired = { $in: skills.split(',') };
    if (minBudget && maxBudget) {
        filter['budget.min'] = { $gte: parseFloat(minBudget) };
        filter['budget.max'] = { $lte: parseFloat(maxBudget) };
    }
    if (category) filter.category = category;
    if (type) filter.paymentType = type;
    if (status) filter.status = status;
    if (location) filter.location = new RegExp(location, 'i');

    const jobs = await Job.find({ ...filter, status: 'open' })
        .populate('client', 'name')
        .select('-proposals');

    res.json(jobs);
});

export const getJobById = asyncHandler(async (req, res) => {
    const job = await Job.findById(req.params.id)
        .populate('client', 'name email avatar')
        .populate({ path: 'proposals.freelancer', select: 'name email avatar skills' });
    
    if (!job) {
        res.status(404);
        throw new Error('Job not found');
    }
    
    if (job.client.toString() !== req.user._id.toString() && !job.proposals.some(p => p.freelancer.toString() === req.user._id.toString())) {
        job.proposals = undefined;
    }
    
    res.json(job);
});

// ----------------- FREELANCER PROPOSAL CONTROLLERS -----------------

export const submitProposal = asyncHandler(async (req, res) => {
    const { coverLetter, bidAmount, estimatedTime, milestones } = req.body;
    const { jobId } = req.params;

    // Check if freelancer has already submitted a proposal
    const existingProposal = await Job.findOne({ 
        _id: jobId, 
        'proposals.freelancer': req.user._id 
    });
    if (existingProposal) {
        res.status(400);
        throw new Error('You have already submitted a proposal for this job');
    }

    const job = await Job.findByIdAndUpdate(
        jobId,
        {
            $push: { proposals: { freelancer: req.user._id, coverLetter, bidAmount, estimatedTime, milestones } },
            $inc: { proposalsCount: 1 } // Increment the counter
        },
        { new: true, runValidators: true } // Return the updated document
    );

    if (!job) {
        res.status(404);
        throw new Error('Job not found or not open for proposals');
    }

    // Create a notification for the client
    await Notification.create({
        recipient: job.client,
        message: `A new proposal has been submitted for your job: ${job.title}`,
        type: 'proposal_status',
        link: `/client/jobs/${job._id}`
    });

    res.status(201).json({ message: 'Proposal submitted successfully', proposal: job.proposals.slice(-1)[0] });
});

export const updateProposal = asyncHandler(async (req, res) => {
    const { jobId, proposalId } = req.params;
    const job = await Job.findById(jobId);

    if (!job) {
        res.status(404);
        throw new Error('Job not found');
    }

    const proposal = job.proposals.id(proposalId);
    if (!proposal || proposal.freelancer.toString() !== req.user._id.toString()) {
        res.status(404);
        throw new Error('Proposal not found or not authorized');
    }

    if (job.status !== 'open' && proposal.status === 'pending') {
        res.status(400);
        throw new Error('Cannot update proposal. Job is no longer open.');
    }

    Object.assign(proposal, req.body);
    await job.save();
    res.json({ message: 'Proposal updated', proposal });
});

// ----------------- CLIENT PROPOSAL & MILESTONE MANAGEMENT -----------------

export const manageProposal = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const { jobId, proposalId } = req.params;
    const job = await Job.findById(jobId);

    if (!job) {
        res.status(404);
        throw new Error('Job not found');
    }
    if (job.client.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to manage this job\'s proposals');
    }

    const proposal = job.proposals.id(proposalId);
    if (!proposal) {
        res.status(404);
        throw new Error('Proposal not found');
    }

    if (proposal.status !== 'pending') {
        res.status(400);
        throw new Error('This proposal is not pending and cannot be managed.');
    }

    proposal.status = status;
    
    if (status === 'accepted') {
        job.status = 'in-progress';
        job.selectedFreelancer = proposal.freelancer;

        // Create a notification for the freelancer
        await Notification.create({
            recipient: proposal.freelancer,
            message: `Your proposal for job "${job.title}" has been accepted!`,
            type: 'proposal_status',
            link: `/contracts/${job._id}`
        });
    }

    await job.save();
    res.json({ message: `Proposal status updated to ${status}`, proposal });
});

export const updateMilestone = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const { jobId, proposalId, milestoneId } = req.params;
    const job = await Job.findById(jobId);

    if (!job) {
        res.status(404);
        throw new Error('Job not found');
    }

    const proposal = job.proposals.id(proposalId);
    if (!proposal) {
        res.status(404);
        throw new Error('Proposal not found');
    }

    const milestone = proposal.milestones.id(milestoneId);
    if (!milestone) {
        res.status(404);
        throw new Error('Milestone not found');
    }

    const isClient = job.client.toString() === req.user._id.toString();
    const isFreelancer = proposal.freelancer.toString() === req.user._id.toString();

    if (!isClient && !isFreelancer) {
        res.status(403);
        throw new Error('Not authorized to update this milestone');
    }

    if (isFreelancer && status === 'completed') {
        milestone.status = 'completed';
        // Notify client that a milestone is completed
        await Notification.create({
            recipient: job.client,
            message: `Milestone "${milestone.title}" for job "${job.title}" has been completed.`,
            type: 'job_update',
            link: `/client/jobs/${job._id}`
        });
    } 
    else if (isClient && (status === 'pending' || status === 'in-progress')) {
        milestone.status = status;
        // Notify freelancer of milestone status change
        await Notification.create({
            recipient: proposal.freelancer,
            message: `The status of milestone "${milestone.title}" for job "${job.title}" has been updated.`,
            type: 'job_update',
            link: `/contracts/${job._id}`
        });
    } else {
        res.status(400).json({ message: 'Invalid status update for your role.' });
        return;
    }

    await job.save();
    res.json({ message: 'Milestone status updated', milestone });
});