import {
  getRecipes,
  getRecipe,
  updateRecipe,
  deleteRecipe,
  createRecipe,
  toggleFavorite,
  toggleLike,
  fetchFavourites,
  fetchUserRecipes,
} from "../controllers/recipeContoller.js";
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.get("/", getRecipes);
router.post("/", upload.single("image"), protect, createRecipe);
router.get("/favorites", protect, fetchFavourites);
router.get("/users/:id/recipes", fetchUserRecipes);
router.put("/:id", protect, updateRecipe);
router.delete("/:id", deleteRecipe);
router.post("/:id/favorite", protect, toggleFavorite);
router.post("/:id/like", protect, toggleLike);
router.get("/:id", getRecipe);

export default router;
