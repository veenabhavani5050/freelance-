// routes/serviceRoutes.js
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
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getAllServices)
  .post(
    protect,
    authorizeRoles('freelancer'),
    upload.array('images', 5), // upload up to 5 images
    validateService,
    createService
  );

router.route('/:id')
  .get(getServiceById)
  .put(
    protect,
    authorizeRoles('freelancer'),
    upload.array('images', 5),
    validateService,
    updateService
  )
  .delete(
    protect,
    authorizeRoles('freelancer'),
    deleteService
  );

export default router;
