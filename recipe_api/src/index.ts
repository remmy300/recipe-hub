import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/server.js";
import express, { Application } from "express";
import recipeRoutes from "./routes/recipeRoutes";
import commentRoutes from "./routes/commentRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;
const app: Application = express();

app.use(cors());
// middleware
app.use(express.json()); //allows to parse JSON bodies: req.body

app.get("/api/auth/test", (req, res) => {
  res.json({ message: "Test route from index ✅" });
});

app.get("/", (req, res) => {
  res.json({ message: "API is working 🚀" });
});

app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.originalUrl}`);
  next();
});

// Routes
app.use("/api/recipe", recipeRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/auth", authRoutes);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`);
  });
});
