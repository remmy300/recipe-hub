import { Request, Response, NextFunction } from "express";
import { Recipe } from "../models/Recipe";
import { Types, InferSchemaType } from "mongoose";

// Fetch all recipes from the DB
export const getRecipes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const recipes = await Recipe.find().sort({ createdAt: -1 }); //show newest  first
    res.json(recipes);
  } catch (error) {
    console.log("Error fetching recipes data:", error);
    res.status(500).json({ message: "Internal server error" });
    next(error);
  }
};

// Fetch a single recipe by its unique Id
export const getRecipe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    res.json(recipe);
  } catch (error) {
    console.log("Error fetching a recipe data:", error);
    res.status(500).json({ message: "Internal server error" });
    next(error);
  }
};

// Update an existing recipe by Id
export const updateRecipe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const updatedRecipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedRecipe);
  } catch (error) {
    console.log("Error updating recipe data:", error);
    res.status(500).json({ message: "Internal server error" });
    next(error);
  }
};

// Create and saves  a new recipe
export const createRecipe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const newRecipe = new Recipe(req.body);
    const saved = await newRecipe.save();
    res.status(201).json(saved);
  } catch (error) {
    console.log("Error creating new recipe data:", error);
    res.status(500).json({ message: "Internal server error" });
    next(error);
  }
};

// Delete a recipe by its Id
export const deleteRecipe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const deletedRecipe = await Recipe.findByIdAndDelete(req.params.id);
    res.json(deletedRecipe);
    res.status(204).end();
  } catch (error) {
    console.log("Error deleting recipe data:", error);
    res.status(500).json({ message: "Internal server error" });
    next(error);
  }
};

export const toggleLike = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = new Types.ObjectId(req.user._id);
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) return res.status(404).json({ message: "Recipe not found" });

    const isLiked = recipe.likes.some((id) => id.equals(userId));

    if (isLiked) {
      recipe.likes = recipe.likes.filter((id) => !id.equals(userId));
    } else {
      recipe.likes.push(userId);
    }

    await recipe.save();
    res.status(200).json({
      message: isLiked ? "Unliked recipe" : "Liked recipe",
      likesCount: recipe.likes.length,
    });
  } catch (error) {
    next(error);
  }
};

export const toggleFavorite = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = new Types.ObjectId(req.user._id);
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) return res.status(404).json({ message: "Recipe not found" });

    const favorites = recipe.favorites as Types.ObjectId[];
    const isFavorited = favorites.some((id) => id.equals(userId));

    if (isFavorited) {
      recipe.favorites = favorites.filter((id) => !id.equals(userId));
    } else {
      favorites.push(userId);
    }

    await recipe.save();

    res.status(200).json({
      message: isFavorited ? "Removed from favorites" : "Added to favorites",
      favoritesCount: favorites.length,
    });
  } catch (error) {
    console.error("Error toggling favorite:", error);
    next(error);
  }
};
