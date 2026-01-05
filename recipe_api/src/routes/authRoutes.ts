import {
  loginUser,
  registerUser,
  getUserProfile,
  googleLogin,
  logOutUser,
  toggleFollow,
  editProfile,
  changePassword,
  deleteAccount,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import express from "express";
import avatarUpload from "../middleware/avatarUpload.js";
console.log(" Auth routes loaded");

const router = express.Router();

router.post("/login", loginUser);
router.post("/logout", logOutUser);
router.post("/google", googleLogin);
router.post("/editProfile", protect, editProfile);
router.post(
  "/uploadAvatar",
  protect,
  avatarUpload.single("avatar"),
  (req, res) => {
    // multer-storage-cloudinary attaches file info; path contains the URL
    res.json({ url: req.file?.path || "" });
  }
);
router.post("/register", registerUser);
router.get("/user", protect, getUserProfile);
router.post("/:id/follow", protect, toggleFollow);
router.post("/changePassword", protect, changePassword);
router.delete("/deleteAccount", protect, deleteAccount);

export default router;
