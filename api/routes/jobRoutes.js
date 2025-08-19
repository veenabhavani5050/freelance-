import express from 'express';
import {
    createJob,
    updateJob,
    deleteJob,
    getMyJobs,
    getAllJobs,
    getJobById,
    submitProposal,
    updateProposal,
    manageProposal,
    updateMilestone,
} from '../controllers/jobController.js';
// FIX: Change 'authorizeRoles' to 'checkRole' to match the authMiddleware.js export
import { protect, checkRole } from '../middleware/authMiddleware.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Validation middleware for job creation and update
const jobValidation = [
    body('title').notEmpty().withMessage('Title is required').trim().escape(),
    body('description').notEmpty().withMessage('Description is required').trim(),
    body('skillsRequired').isArray().withMessage('Skills must be an array'),
    body('paymentType').isIn(['fixed', 'hourly']).withMessage('Invalid payment type'),
    body('jobType').isIn(['remote', 'hybrid', 'on-site']).withMessage('Invalid job type'),
    body('category').notEmpty().withMessage('Category is required').trim(),
    body('budget.min').isNumeric().withMessage('Minimum budget must be a number'),
    body('budget.max').isNumeric().withMessage('Maximum budget must be a number'),
    body('deadline').optional({ checkFalsy: true }).isISO8601().toDate().withMessage('Invalid deadline date format'),
    body('companyName').optional({ checkFalsy: true }).trim().escape(),
    body('estimatedDuration').optional({ checkFalsy: true }).trim().escape(),
];

// ------------------- CLIENT JOB ROUTES -------------------
// FIX: Change 'authorizeRoles' to 'checkRole' in all routes
router.post('/', protect, checkRole('client'), jobValidation, createJob);
router.get('/my-jobs', protect, checkRole('client'), getMyJobs);
router.put('/:id', protect, checkRole('client'), jobValidation, updateJob);
router.delete('/:id', protect, checkRole('client'), deleteJob);

// ------------------- FREELANCER/PUBLIC JOB ROUTES -------------------
router.get('/', getAllJobs); // Publicly accessible to freelancers
router.get('/:id', protect, getJobById); // Protected to ensure user is logged in

// ------------------- FREELANCER PROPOSAL ROUTES -------------------
// FIX: Change 'authorizeRoles' to 'checkRole' in all routes
router.post('/:jobId/proposals', protect, checkRole('freelancer'), submitProposal);
router.put('/:jobId/proposals/:proposalId', protect, checkRole('freelancer'), updateProposal);

// ------------------- CLIENT PROPOSAL & MILESTONE MANAGEMENT -------------------
// FIX: Change 'authorizeRoles' to 'checkRole' in all routes
router.put('/:jobId/proposals/:proposalId/manage', protect, checkRole('client'), manageProposal);
router.put('/:jobId/proposals/:proposalId/milestones/:milestoneId', protect, updateMilestone);

export default router;