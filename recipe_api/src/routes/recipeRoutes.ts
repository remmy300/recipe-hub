import {
  getRecipes,
  getRecipe,
  updateRecipe,
  deleteRecipe,
  createRecipe,
  toggleFavorite,
  toggleLike,
} from "../controllers/recipeContoller";
import express from "express";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/", getRecipes);
router.get("/:id", getRecipe);
router.post("/", createRecipe);
router.put("/:id", updateRecipe);
router.delete("/:id", deleteRecipe);
router.post("/:id/favorite", protect, toggleFavorite);
router.post("/:id/like", protect, toggleLike);

export default router;
