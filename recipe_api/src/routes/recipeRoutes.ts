import {
  getRecipes,
  getRecipe,
  updateRecipe,
  deleteRecipe,
  createRecipe,
} from "../controllers/recipeContoller";
import express from "express";

const router = express.Router();

router.get("/", getRecipes);
router.get("/:id", getRecipe);
router.post("/", createRecipe);
router.put("/:id", updateRecipe);
router.delete("/:id", deleteRecipe);

export default router;
