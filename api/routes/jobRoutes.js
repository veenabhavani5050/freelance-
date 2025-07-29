// ✅ Express Router - routes/jobRoutes.js
import express from 'express';
import {
  createJob,
  getAllJobs,
  getMyJobs,
  deleteJob,
  getJobById,
  updateJob,
} from '../controllers/jobController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createJob);               // POST /api/jobs
router.get('/', getAllJobs);                        // GET /api/jobs
router.get('/my-jobs', protect, getMyJobs);         // GET /api/jobs/my-jobs
router.get('/:id', protect, getJobById);            // GET /api/jobs/:id
router.put('/:id', protect, updateJob);             // PUT /api/jobs/:id
router.delete('/:id', protect, deleteJob);          // DELETE /api/jobs/:id

export default router;