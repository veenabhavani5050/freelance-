// middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

// Middleware to protect routes
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check Authorization header first, then cookie
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized — no token provided');
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // attach user (exclude password)
    const userId = decoded.id || decoded.userId;
    if (!userId) {
      res.status(401);
      throw new Error('Not authorized — invalid token payload');
    }

    const user = await User.findById(userId).select('-password');
    if (!user) {
      res.status(401);
      throw new Error('Not authorized — user not found');
    }

    req.user = user;
    next();
  } catch (err) {
    // provide a slightly more descriptive message for token expiry
    const msg = err.name === 'TokenExpiredError' ? 'Not authorized — token expired' : 'Not authorized — token invalid';
    res.status(401);
    throw new Error(msg);
  }
});

// Middleware to authorize user based on roles
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403);
      throw new Error('Access denied: Insufficient role');
    }
    next();
  };
};
