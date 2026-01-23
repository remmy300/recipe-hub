import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI =
  process.env.MONGO_URI ||
  process.env.MONGODB_URI ||
  process.env.MONGO_URL ||
  process.env.DATABASE_URL;

if (!MONGO_URI) {
  throw new Error(
    "Missing MongoDB connection string (MONGO_URI / MONGODB_URI / MONGO_URL / DATABASE_URL)",
  );
}

// Global cache
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = {
    conn: null,
    promise: null,
  };
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const start = Date.now();

    cached.promise = mongoose
      .connect(MONGO_URI as string, {
        bufferCommands: false,
        serverSelectionTimeoutMS: 5000,
      })
      .then((mongoose) => {
        console.log(`MongoDB connected (cached) in ${Date.now() - start}ms`);
        return mongoose;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
