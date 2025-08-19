import asyncHandler from 'express-async-handler';
import Stripe from 'stripe';
import Job from '../models/Job.js';

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// @desc    Create a payment intent
// @route   POST /api/payments/create-intent
// @access  Private (Client)
export const createPaymentIntent = asyncHandler(async (req, res) => {
    const { jobId } = req.body;

    const job = await Job.findById(jobId);

    if (!job || job.client.toString() !== req.user._id.toString()) {
        res.status(404);
        throw new Error('Job not found or not authorized to pay for this job.');
    }

    // Assuming a fixed price job. For milestones, you'd calculate the milestone amount.
    const amountInCents = job.budget.max * 100;

    const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInCents,
        currency: 'inr',
        metadata: { jobId: job._id.toString() },
    });

    res.json({
        clientSecret: paymentIntent.client_secret,
    });
});