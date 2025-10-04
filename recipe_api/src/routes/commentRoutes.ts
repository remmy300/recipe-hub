import {
  getCommentForRecipe,
  deleteCommentForRecipe,
  addComment,
} from "../controllers/commentController";
import express from "express";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/recipe/:id", protect, addComment);
router.get("/recipe/:recipeId", getCommentForRecipe);
router.delete("/:id", protect, deleteCommentForRecipe);

export default router;
