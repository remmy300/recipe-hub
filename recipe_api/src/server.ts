import dotenv from "dotenv";
import { connectDB } from "./config/server.js";
import app from "./index.js";

dotenv.config();

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};
startServer();
