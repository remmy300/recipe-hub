import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI as string;

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI).then(() => {
      console.log("MongoDB succesfully connected!");
    });
  } catch (err: unknown) {
    console.log("Database connection error:", err);
    process.exit(1);
  }
};
