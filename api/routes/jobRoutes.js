// routes/jobRoutes.js
import express from 'express';
import {
  createJob,
  getAllJobs,
  getMyJobs, // ✅ Import
} from '../controllers/jobController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createJob);
router.get('/', getAllJobs);
router.get('/my-jobs', protect, getMyJobs); // ✅ Route to get jobs posted by logged-in client

export default router;
