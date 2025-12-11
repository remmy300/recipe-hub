import cors from "cors";
import express, { Application } from "express";
import recipeRoutes from "./routes/recipeRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import rateLimiter from "./middleware/rateLimiter.js";
import errorHandler from "./middleware/errorHandler.js";
import cookieParser from "cookie-parser";

const app: Application = express();

// CORS configuration
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:3000",
  "http://127.0.0.1:3000",
].filter((origin): origin is string => Boolean(origin));

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
};

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use("/", express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Only enable rate limiter outside tests
if (process.env.NODE_ENV !== "test") {
  // app.use("/api", rateLimiter);
}

// Routes
app.use("/api/recipes", recipeRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/auth", authRoutes);

// Global error handler
app.use(errorHandler);

export default app;
