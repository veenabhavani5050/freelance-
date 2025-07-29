// backend/app.js
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import passport from './config/passport.js';

// 🆕 Validation Middleware Import (for side effects or schema hooks)
import './middleware/validationMiddleware.js'; 

// Routes
import authRoutes from './routes/authRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import jobRoutes from './routes/jobRoutes.js';

// Error handling middlewares
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();

const app = express();

// CORS Setup
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

// Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Session
app.use(session({
  secret: process.env.SESSION_SECRET || 'mysecret',
  resave: false,
  saveUninitialized: false,
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/jobs', jobRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

export default app;
