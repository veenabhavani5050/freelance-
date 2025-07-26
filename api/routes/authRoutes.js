// routes/authRoutes.js
import express from 'express';
import passport from '../config/passport.js';
import {
  registerUser,
  authUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  getUserProfile,
  updateUserProfile,
  googleLogin,          // ✅ IMPORTED HERE
  googleCallback,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public Auth Routes
router.post('/register', registerUser);
router.post('/login', authUser);
router.post('/logout', logoutUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset/:token', resetPassword);

// ✅ Google One Tap (GSI Token) Route
router.post('/google', googleLogin); // ✅ NEW route added

// Google OAuth Redirect Flow
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${process.env.FRONTEND_URL}/login`,
    session: false,
  }),
  googleCallback
);

// Protected User Routes
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

export default router;
