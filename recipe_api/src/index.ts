import cors from "cors";
import express, { Application } from "express";
import recipeRoutes from "./routes/recipeRoutes";
import commentRoutes from "./routes/commentRoutes";
import authRoutes from "./routes/authRoutes";
import rateLimiter from "./middleware/rateLimiter";
import errorHandler from "./middleware/errorHandler";

const app: Application = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Only enable rate limiter outside tests
if (process.env.NODE_ENV !== "test") {
  app.use("/api", rateLimiter);
}

// Routes
app.use("/api/recipe", recipeRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/auth", authRoutes);

// Global error handler
app.use(errorHandler);

export default app;
