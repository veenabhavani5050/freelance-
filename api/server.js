import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import app from "./app.js";

dotenv.config();

// Ensure uploads directory exists
const uploadsDir = path.join(path.resolve(), "uploads/services");
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () =>
    console.log(`🚀 Server running in ${process.env.NODE_ENV} on port ${PORT}`)
);

// Handle crashes gracefully
process.on("unhandledRejection", (err) => {
    console.error("❌ Unhandled Promise Rejection:", err.message);
    server.close(() => process.exit(1));
});

process.on("uncaughtException", (err) => {
    console.error("❌ Uncaught Exception:", err.message);
    process.exit(1);
});