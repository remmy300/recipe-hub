import {
  loginUser,
  registerUser,
  getUserProfile,
  googleLogin,
  logOutUser,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import express from "express";
console.log(" Auth routes loaded");

const router = express.Router();

router.post("/login", loginUser);
router.post("/logout", logOutUser);
router.post("/google", googleLogin);
router.post("/register", registerUser);
router.get("/user", protect, getUserProfile);

export default router;
