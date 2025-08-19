import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import passport from "./config/passport.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import connectDB from "./config/db.js";

// Import all your routes
import authRoutes from "./routes/authRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import contractRoutes from "./routes/contractRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import proposalRoutes from "./routes/proposalRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";

dotenv.config();

// Connect to DB once here
connectDB();

const app = express();

// CORS Setup
app.use(
    cors({
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        credentials: true,
    })
);

// Body Parsers
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// Session
app.use(
    session({
        secret: process.env.SESSION_SECRET || "mysecret",
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: process.env.NODE_ENV === "production",
            httpOnly: true,
            sameSite: "lax",
        },
    })
);

// Passport
app.use(passport.initialize());
app.use(passport.session());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/contracts", contractRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/users", userRoutes);
app.use("/api/proposals", proposalRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/notifications", notificationRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

export default app;