// routes/authRoutes.js
import express from 'express';
import {
  registerUser,
  authUser,
  logoutUser,
  forgotPassword,
  resetPassword
} from '../controllers/authController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authUser);
router.post('/logout', logoutUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset/:token', resetPassword);

export default router;
