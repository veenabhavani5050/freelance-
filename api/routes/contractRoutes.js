// routes/contractRoutes.js
import express from 'express';
import {
  createContract,
  getMyContracts,
  updateContractStatus,
  completeMilestone,
  updateMilestone,
  deleteContract,
  approveMilestone
} from '../controllers/contractController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createContract)
  .get(protect, getMyContracts);

// Status change (accept/cancel/start/complete)
router.route('/:id/status').patch(protect, updateContractStatus);

// Soft delete
router.route('/:id/delete').delete(protect, deleteContract);

// Milestone endpoints
router.route('/:id/milestones/:milestoneIndex/complete').patch(protect, completeMilestone);
// client approves and triggers payment
router.route('/:id/milestones/:milestoneIndex/approve').patch(protect, approveMilestone);

router.route('/:id/milestones/:milestoneIndex/edit').patch(protect, updateMilestone);

export default router;
