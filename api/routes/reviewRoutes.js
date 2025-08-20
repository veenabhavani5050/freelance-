import express from 'express';
import { submitReview, getReviewsByFreelancerId } from '../controllers/reviewController.js';
import { protect, checkRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/:jobId', protect, checkRole('client'), submitReview);
router.get('/freelancer/:freelancerId', getReviewsByFreelancerId);

export default router;
