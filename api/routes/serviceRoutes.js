import express from 'express';
import {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
  getMyServices,
} from '../controllers/serviceController.js';
import { protect, checkRole } from '../middleware/authMiddleware.js'; // FIX: Change 'authorizeRoles' to 'checkRole'
import { validateService } from '../middleware/validationMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getAllServices)
  .post(
    protect,
    checkRole('freelancer'), // FIX: Change 'authorizeRoles' to 'checkRole'
    upload.array('images', 5), // upload up to 5 images
    validateService,
    createService
  );

// Logged-in freelancer's services
router.route('/my-services')
  .get(protect, checkRole('freelancer'), getMyServices); // FIX: Change 'authorizeRoles' to 'checkRole'

router.route('/:id')
  .get(getServiceById)
  .put(
    protect,
    checkRole('freelancer'), // FIX: Change 'authorizeRoles' to 'checkRole'
    upload.array('images', 5),
    validateService,
    updateService
  )
  .delete(
    protect,
    checkRole('freelancer'), // FIX: Change 'authorizeRoles' to 'checkRole'
    deleteService
  );

export default router;