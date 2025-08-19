import express from 'express';
import { submitReview, getReviewsByFreelancerId } from '../controllers/reviewController.js';
import { protect, client } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/:jobId', protect, client, submitReview);
router.get('/freelancer/:freelancerId', getReviewsByFreelancerId);

export default router;