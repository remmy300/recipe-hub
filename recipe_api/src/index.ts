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
// Support a single FRONTEND_URL or comma-separated FRONTEND_URLS env var
const envOrigins = (process.env.FRONTEND_URLS || process.env.FRONTEND_URL || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const allowedOrigins = [
  ...envOrigins,
  "http://localhost:3000",
  "http://127.0.0.1:3000",
].filter((o, i, arr) => arr.indexOf(o) === i);

console.log("Allowed CORS origins:", allowedOrigins);

const corsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) => {
    // allow requests with no origin (server-to-server, curl, mobile)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("CORS not allowed by server"));
  },
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
