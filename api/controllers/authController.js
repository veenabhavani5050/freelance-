import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.js';
import sendEmail from '../utils/sendEmail.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Utility: Generate JWT
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

// Utility: Set JWT cookie
const setTokenCookie = (res, token) => {
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
};

// Register user
export const registerUser = asyncHandler(async (req, res) => {
  const {
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
  } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
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
  });

  const token = generateToken(user._id);
  setTokenCookie(res, token);

  res.status(201).json({
    token,
    user: {
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
    },
  });
});

// Login user
export const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    const token = generateToken(user._id);
    setTokenCookie(res, token);

    res.json({
      token,
      user: {
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
      },
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// Google Login via One Tap / GSI
export const googleLogin = asyncHandler(async (req, res) => {
  try {
    const { credential } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub: googleId } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        password: googleId,
        role: 'freelancer',
        profilePic: picture,
        isGoogleUser: true,
      });
    }

    const token = generateToken(user._id);
    setTokenCookie(res, token);

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePic: user.profilePic,
      },
    });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(401).json({ message: 'Google login failed' });
  }
});

// Google OAuth Callback (used with Passport.js if needed)
export const googleCallback = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user) {
    res.status(401);
    throw new Error('Google authentication failed');
  }

  const token = generateToken(user._id);
  setTokenCookie(res, token);

  res.redirect(`${process.env.FRONTEND_URL}/oauth-success?token=${token}`);
});

// Logout
export const logoutUser = asyncHandler(async (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
});

// Forgot Password
export const forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  await sendEmail({
    to: user.email,
    subject: 'Password Reset Request',
    text: `Click the link to reset your password: ${resetUrl}`,
  });

  res.status(200).json({ message: 'Password reset link sent to email' });
});

// Reset Password
export const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  let decoded;

  try {
    decoded = jwt.verify(req.params.token, process.env.JWT_SECRET);
  } catch (error) {
    res.status(400);
    throw new Error('Invalid or expired reset token');
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    res.status(400);
    throw new Error('Invalid user');
  }

  user.password = password;
  await user.save();

  res.status(200).json({ message: 'Password reset successful' });
});

// Get Profile
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
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
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// Update Profile
export const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.bio = req.body.bio ?? user.bio;
    user.profilePic = req.body.profilePic ?? user.profilePic;
    user.skills = req.body.skills ?? user.skills;
    user.location = req.body.location ?? user.location;
    user.portfolioLinks = req.body.portfolioLinks ?? user.portfolioLinks;
    user.availability = req.body.availability ?? user.availability;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      bio: updatedUser.bio,
      profilePic: updatedUser.profilePic,
      skills: updatedUser.skills,
      location: updatedUser.location,
      portfolioLinks: updatedUser.portfolioLinks,
      availability: updatedUser.availability,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});