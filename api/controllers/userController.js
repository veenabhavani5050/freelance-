import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

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
 * Get all freelancers
 */
const getAllFreelancers = asyncHandler(async (req, res) => {
  const freelancers = await User.find({ role: 'freelancer' }).select('-password');
  if (!freelancers || freelancers.length === 0) {
    res.status(404);
    throw new Error('No freelancers found');
  }
  res.json(freelancers.map(userPayload));
});

/**
 * Get a single freelancer's public profile
 */
const getFreelancerProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user || user.role !== 'freelancer') {
    res.status(404);
    throw new Error('Freelancer not found');
  }
  res.json(userPayload(user));
});

/**
 * Get authenticated user's profile
 */
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.json(userPayload(user));
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

/**
 * Update authenticated user's profile
 */
const updateUserProfile = asyncHandler(async (req, res) => {
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

    if (req.body.password && user.provider === 'local') {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();
    res.json(userPayload(updatedUser));
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

export { getAllFreelancers, getFreelancerProfile, getUserProfile, updateUserProfile };
