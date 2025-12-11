import {
  getCommentForRecipe,
  deleteCommentForRecipe,
  addComment,
} from "../controllers/commentController.js";
import express from "express";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/recipe/:id", protect, addComment);
router.get("/recipe/:recipeId", getCommentForRecipe);
router.delete("/:id", protect, deleteCommentForRecipe);

export default router;
