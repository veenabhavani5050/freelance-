import express from 'express';
import passport from '../config/passport.js';
import rateLimit from 'express-rate-limit';
import {
  registerUser,
  authUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  getUserProfile,
  updateUserProfile,
  googleLogin,
  googleCallback,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * ========================
 * Rate Limiters
 * ========================
 */
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50,
  message: { message: 'Too many login attempts. Try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const forgotLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: { message: 'Too many password reset requests. Try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * ========================
 * Public Auth Routes
 * ========================
 */
router.post('/register', registerUser);
router.post('/login', loginLimiter, authUser);
router.post('/logout', logoutUser);
router.post('/forgot-password', forgotLimiter, forgotPassword);
router.post('/reset/:token', resetPassword);

/**
 * ========================
 * Google One-Tap Login
 * ========================
 */
router.post('/google', googleLogin);

/**
 * ========================
 * Google OAuth Login
 * ========================
 */
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${process.env.FRONTEND_URL}/login`,
    session: false,
  }),
  googleCallback
);

/**
 * ========================
 * Protected Routes (JWT)
 * ========================
 */
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

export default router;
