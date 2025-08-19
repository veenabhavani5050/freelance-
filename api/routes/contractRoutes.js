import express from 'express';
import {
  createContract,
  getMyContracts,
  getContractById,
  updateContractStatus,
  completeMilestone,
  updateMilestone,
  deleteContract,
  approveMilestone,
  createReview,
} from '../controllers/contractController.js';
// FIX: Change 'authorizeRoles' to 'checkRole'
import { protect, checkRole } from '../middleware/authMiddleware.js'; 

const router = express.Router();

// Create contract (only clients) & Get contracts (both roles)
router
  .route('/')
  .post(protect, checkRole('client'), createContract) // FIX: Change 'authorizeRoles' to 'checkRole'
  .get(protect, getMyContracts);

// Get single contract
router.route('/:id').get(protect, getContractById);

// Update contract status (client accepts/cancels, freelancer marks progress)
router.route('/:id/status').patch(protect, updateContractStatus);

// Soft delete contract (client or freelancer)
router.route('/:id').delete(protect, deleteContract);

// Milestones
// Freelancer marks milestone complete
router
  .route('/:id/milestones/:milestoneIndex/complete')
  .patch(protect, checkRole('freelancer'), completeMilestone); // FIX: Change 'authorizeRoles' to 'checkRole'

// Client approves milestone & releases payment
router
  .route('/:id/milestones/:milestoneIndex/approve')
  .patch(protect, checkRole('client'), approveMilestone); // FIX: Change 'authorizeRoles' to 'checkRole'

// Client updates milestone details
router
  .route('/:id/milestones/:milestoneIndex')
  .patch(protect, checkRole('client'), updateMilestone); // FIX: Change 'authorizeRoles' to 'checkRole'

// Add review after contract completion (only clients)
router.route('/:id/review').post(protect, checkRole('client'), createReview); // FIX: Change 'authorizeRoles' to 'checkRole'

export default router;