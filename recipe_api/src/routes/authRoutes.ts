import {
  loginUser,
  registerUser,
  getUserProfile,
} from "../controllers/authController";
import { protect } from "../middleware/authMiddleware";
import express from "express";
console.log("✅ Auth routes loaded");

const router = express.Router();

router.post("/login", loginUser);
router.post("/register", registerUser);
router.get("/user", protect, getUserProfile);

export default router;
