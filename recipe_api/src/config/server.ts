import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";

const MONGO_URI =
  process.env.MONGO_URI ||
  process.env.MONGODB_URI ||
  process.env.MONGO_URL ||
  process.env.DATABASE_URL;

export const connectDB = async () => {
  if (!MONGO_URI) {
    console.error(
      "Missing MongoDB connection string. Set one of: MONGO_URI, MONGODB_URI, MONGO_URL, DATABASE_URL"
    );
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB successfully connected!");
  } catch (err: unknown) {
    console.error("Database connection error:", err);
    process.exit(1);
  }
};
