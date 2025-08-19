// api/routes/userRoutes.js
import express from 'express';
import { getAllFreelancers } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all freelancers
router.route('/freelancers').get(protect, getAllFreelancers);

export default router;
