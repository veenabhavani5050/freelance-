// api/routes/proposalRoutes.js (No changes needed, included for completeness)

import express from 'express';
import {
  createProposal,
  getProposalsByJobId,
  getMyProposals,
} from '../controllers/proposalController.js';
import { protect, checkRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, checkRole('freelancer'), createProposal);

router.route('/job/:jobId')
  .get(protect, checkRole('client'), getProposalsByJobId);

router.route('/my-proposals')
  .get(protect, checkRole('freelancer'), getMyProposals);

export default router;