import asyncHandler from 'express-async-handler';
import { OAuth2Client } from 'google-auth-library';
import crypto from 'crypto';
import User from '../models/User.js';
import sendEmail from '../utils/sendEmail.js';
import createSendToken from '../utils/generateToken.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Helper function to shape the user object for the client
const userPayload = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  bio: user.bio,
  profilePic: user.profilePic,
  skills: user.skills,
  location: user.location,
  portfolioLinks: user.portfolioLinks,
  availability: user.availability,
});

/**
 * Register
 */
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, bio, profilePic, skills, location, portfolioLinks, availability } = req.body;

  if (!name || !email || !role) {
    res.status(400);
    throw new Error('Name, email, and role are required.');
  }

  const allowedRoles = ['freelancer', 'client'];
  if (!allowedRoles.includes(role)) {
    res.status(400);
    throw new Error(`Invalid role. Allowed roles are: ${allowedRoles.join(', ')}`);
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('A user with this email already exists.');
  }

  const user = await User.create({
    name,
    email,
    password,
    role,
    bio,
    profilePic,
    skills,
    location,
    portfolioLinks,
    availability,
    provider: 'local',
  });

  const token = createSendToken(res, user);
  res.status(201).json({ token, user: userPayload(user) });
});

/**
 * Login
 */
export const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Email and password are required.');
  }

  const user = await User.findOne({ email }).select('+password');
  if (user && (await user.matchPassword(password))) {
    const token = createSendToken(res, user);
    res.json({ token, user: userPayload(user) });
  } else {
    res.status(401);
    throw new Error('Invalid email or password.');
  }
});

/**
 * Google Login
 */
export const googleLogin = asyncHandler(async (req, res) => {
  const { credential, role } = req.body;
  if (!credential) {
    res.status(400);
    throw new Error('No credential provided.');
  }

  const ticket = await client.verifyIdToken({
    idToken: credential,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  const { email, name, picture, sub: googleId } = payload;

  let user = await User.findOne({ email });

  if (!user) {
    if (!role) {
      res.status(400);
      throw new Error('Role is required for a first-time Google sign up (client or freelancer).');
    }
    const allowedRoles = ['freelancer', 'client'];
    if (!allowedRoles.includes(role)) {
      res.status(400);
      throw new Error(`Invalid role. Allowed roles are: ${allowedRoles.join(', ')}`);
    }

    user = await User.create({
      name,
      email,
      googleId,
      role,
      profilePic: picture,
      provider: 'google',
    });
  } else {
    let changed = false;
    if (!user.googleId) {
      user.googleId = googleId;
      changed = true;
      if (!user.password) user.provider = 'google';
    }
    if (role && role !== user.role) {
      res.status(400);
      throw new Error('Role mismatch with existing account. Please update your role in profile settings.');
    }
    if (changed) await user.save();
  }

  const token = createSendToken(res, user);
  res.json({ token, user: userPayload(user) });
});

/**
 * Google OAuth Callback
 */
export const googleCallback = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user) {
    res.status(401);
    throw new Error('Google authentication failed.');
  }
  const token = createSendToken(res, user);
  res.redirect(`${process.env.FRONTEND_URL}/oauth-success?token=${token}`);
});

/**
 * Logout
 */
export const logoutUser = asyncHandler(async (req, res) => {
  res.cookie('jwt', '', { httpOnly: true, expires: new Date(0) });
  res.status(200).json({ message: 'Logged out successfully!' });
});

/**
 * Forgot Password
 */
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    res.status(400);
    throw new Error('Email is required.');
  }

  const user = await User.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error('User not found.');
  }

  const rawToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = Date.now() + 60 * 60 * 1000;
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${rawToken}`;

  await sendEmail({
    to: user.email,
    subject: 'Password Reset Request',
    text: `Click here to reset your password: ${resetUrl}`,
  });

  res.status(200).json({ message: 'Password reset link sent to your email.' });
});

/**
 * Reset Password
 */
export const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!token || !password) {
    res.status(400);
    throw new Error('Token and new password are required.');
  }

  const hashed = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({
    resetPasswordToken: hashed,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error('Invalid or expired password reset token.');
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  const createdToken = createSendToken(res, user);
  res.status(200).json({ message: 'Password reset successful!', token: createdToken, user: userPayload(user) });
});

/**
 * Get User Profile
 */
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('User not found.');
  }
  res.json(userPayload(user));
});

/**
 * Update User Profile
 */
export const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('User not found.');
  }

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  user.bio = req.body.bio ?? user.bio;
  user.profilePic = req.body.profilePic ?? user.profilePic;
  user.skills = req.body.skills ?? user.skills;
  user.location = req.body.location ?? user.location;
  user.portfolioLinks = req.body.portfolioLinks ?? user.portfolioLinks;
  user.availability = req.body.availability ?? user.availability;

  if (req.body.password) {
    if (user.provider !== 'local' && !user.password) {
      res.status(400);
      throw new Error('Cannot set password on an OAuth-only account.');
    }
    user.password = req.body.password;
  }

  const updatedUser = await user.save();
  res.json(userPayload(updatedUser));
});
