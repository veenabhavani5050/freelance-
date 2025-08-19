// --- api/config/db.js ---
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // Set strictQuery to true or false. false is recommended for compatibility.
    mongoose.set("strictQuery", false);

    // Use environment variable for the connection URI
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // Fail fast if DB is unreachable
    });

    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    // Exit process with failure
    process.exit(1);
  }
};

export default connectDB;