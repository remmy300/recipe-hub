import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import express, { Application } from "express";

const app: Application = express();

const MONGO_URI = process.env.MONGO_URI as string;
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI).then(() => {
      console.log("MongoDB succesfully connected!");
      app.listen(PORT, () => {
        console.log(`Sever running on port ${PORT}`);
      });
    });
  } catch (err: unknown) {
    console.log("Database connection error:", err);
    process.exit(1);
  }
};
