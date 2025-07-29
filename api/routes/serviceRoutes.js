import express from 'express';
import {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
} from '../controllers/serviceController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';
import { validateService } from '../middleware/validationMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getAllServices)
  .post(
    protect,
    authorizeRoles('freelancer'),
    validateService,
    createService
  );

router.route('/:id')
  .get(getServiceById)
  .put(
    protect,
    authorizeRoles('freelancer'),
    validateService,
    updateService
  )
  .delete(
    protect,
    authorizeRoles('freelancer'),
    deleteService
  );

export default router;
