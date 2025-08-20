// controllers/reviewController.js

import asyncHandler from 'express-async-handler';
import Review from '../models/Review.js';
import Job from '../models/Job.js';
import User from '../models/User.js';
import { validationResult } from 'express-validator';

// @desc    Create a new review for a freelancer
// @route   POST /api/reviews/:jobId
// @access  Private (Client only)
// NOTE: Renamed the function from 'createReview' to 'submitReview'
// to match the import name in reviewRoutes.js
export const submitReview = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rating, comment } = req.body;
    const { jobId } = req.params;
    const client = req.user._id;

    // 1. Find the job and check if it's completed and belongs to the client
    const job = await Job.findById(jobId);
    if (!job) {
        res.status(404);
        throw new Error('Job not found');
    }
    if (job.client.toString() !== client.toString()) {
        res.status(403);
        throw new Error('Not authorized to review this job');
    }
    if (job.status !== 'completed') {
        res.status(400);
        throw new Error('Cannot review a job that is not completed');
    }
    if (job.review) {
        res.status(400);
        throw new Error('This job has already been reviewed');
    }

    // 2. Get the freelancer who worked on the job
    const acceptedProposal = job.proposals.find(p => p.status === 'accepted');
    if (!acceptedProposal) {
        res.status(400);
        throw new Error('No accepted proposal found for this job');
    }
    const freelancer = acceptedProposal.freelancer;

    // 3. Create the review
    const review = await Review.create({
        job: jobId,
        freelancer,
        client,
        rating,
        comment,
    });

    // 4. Update the job with the new review ID
    job.review = review._id;
    await job.save();

    // 5. Update the freelancer's profile with new rating
    const userToUpdate = await User.findById(freelancer);
    if (userToUpdate) {
        const totalReviews = userToUpdate.numReviews + 1;
        const newRating = ((userToUpdate.rating * userToUpdate.numReviews) + rating) / totalReviews;
        userToUpdate.rating = newRating;
        userToUpdate.numReviews = totalReviews;
        await userToUpdate.save();
    }

    res.status(201).json(review);
});

// @desc    Get all reviews for a specific freelancer
// @route   GET /api/reviews/freelancer/:freelancerId
// @access  Public
export const getReviewsByFreelancerId = asyncHandler(async (req, res) => {
    const reviews = await Review.find({ freelancer: req.params.freelancerId })
        .populate('client', 'name profilePic')
        .populate('job', 'title');

    res.json(reviews);
});