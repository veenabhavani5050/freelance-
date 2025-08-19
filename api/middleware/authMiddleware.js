import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';
const COOKIE_NAME = 'jwt';

/**
 * Middleware: Protect routes (authentication required)
 */
export const protect = asyncHandler(async (req, res, next) => {
    let token;

    // Prefer Authorization header, fallback to cookie
    if (req.headers.authorization?.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies[COOKIE_NAME]) {
        token = req.cookies[COOKIE_NAME];
    }

    if (!token) {
        res.status(401);
        throw new Error('Not authorized — no token provided');
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.userId).select('-password');

        if (!user) {
            res.status(401);
            throw new Error('Not authorized — user not found');
        }

        // Check if password was changed after token was issued
        const tokenIssuedAt = decoded.iat * 1000;
        if (user.passwordChangedAt && user.passwordChangedAt.getTime() > tokenIssuedAt) {
            res.status(401);
            throw new Error('Not authorized — password changed, please login again');
        }

        req.user = user;
        next();
    } catch (err) {
        const msg =
            err.name === 'TokenExpiredError'
                ? 'Not authorized — token expired'
                : 'Not authorized — invalid token';
        res.status(401);
        throw new Error(msg);
    }
});

/**
 * Middleware: Role-based authorization
 */
export const checkRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            res.status(403);
            throw new Error('Access denied — insufficient role');
        }
        next();
    };
};