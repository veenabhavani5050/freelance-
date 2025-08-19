import asyncHandler from 'express-async-handler';
import Proposal from '../models/Proposal.js';
import Job from '../models/Job.js';

// @desc    Create a new proposal
// @route   POST /api/proposals
// @access  Private (Freelancer)
export const createProposal = asyncHandler(async (req, res) => {
  const { job, coverLetter, bidAmount, estimatedCompletionTime } = req.body;
  const freelancerId = req.user._id;

  // Check if job exists and is open
  const jobExists = await Job.findById(job);
  if (!jobExists || jobExists.status !== 'open') {
    res.status(404);
    throw new Error('Job not found or not available for proposals');
  }

  // Check if freelancer has already submitted a proposal for this job
  const existingProposal = await Proposal.findOne({ job, freelancer: freelancerId });
  if (existingProposal) {
    res.status(400);
    throw new Error('You have already submitted a proposal for this job');
  }

  const proposal = await Proposal.create({
    job,
    freelancer: freelancerId,
    coverLetter,
    bidAmount,
    estimatedCompletionTime,
  });

  res.status(201).json({
    success: true,
    data: proposal,
  });
});

// @desc    Get all proposals for a specific job (Client)
// @route   GET /api/proposals/job/:jobId
// @access  Private (Client)
export const getProposalsByJobId = asyncHandler(async (req, res) => {
  const proposals = await Proposal.find({ job: req.params.jobId }).populate('freelancer', 'name email');
  res.status(200).json({
    success: true,
    data: proposals,
  });
});

// @desc    Get all proposals submitted by the logged-in freelancer
// @route   GET /api/proposals/my-proposals
// @access  Private (Freelancer)
export const getMyProposals = asyncHandler(async (req, res) => {
  try {
    // Log to confirm the request reached the controller
    console.log('Fetching proposals for freelancer:', req.user._id);

    // The .populate() method can fail if a referenced ID is invalid or a document is deleted.
    // Adding .exec() can help, and the try/catch block will now catch any errors.
    const proposals = await Proposal.find({ freelancer: req.user._id })
      .populate('job', 'title budget')
      .exec();

    // Log the number of proposals found
    console.log(`Found ${proposals.length} proposals.`);

    res.status(200).json({
      success: true,
      data: proposals,
    });
  } catch (error) {
    // If an error occurs, send a proper 500 status and an error message.
    console.error('Error fetching proposals:', error);
    res.status(500);
    throw new Error('Failed to fetch proposals. Please try again later.');
  }
});