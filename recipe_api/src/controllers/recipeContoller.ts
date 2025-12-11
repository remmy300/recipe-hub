import { Request, Response, NextFunction } from "express";
import { Recipe } from "../models/Recipe.js";
import { Types } from "mongoose";
import mongoose from "mongoose";

const safeParse = (value: any) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;

  try {
    return JSON.parse(value);
  } catch {
    return value.split(",").map((v: string) => v.trim());
  }
};

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
    const { id } = req.params;
    // BLOCK INVALID IDS IMMEDIATELY
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid recipe ID" });
    }
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
    const { title, ingredients, description, instructions } = req.body;
    const newRecipe = new Recipe({
      title,
      description,
      instructions: safeParse(instructions),
      cookingTime: Number(req.body.cookingTime),
      servings: Number(req.body.servings),
      ingredients: safeParse(ingredients),
      imageUrl: req.file?.path || "",
      user: req.user._id,
    });

    const saved = await newRecipe.save();
    res.status(201).json(saved);
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);
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

    if (!deletedRecipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    res.status(200).json({ success: true, id: req.params.id });
  } catch (error) {
    console.error("Error deleting recipe:", error);
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
    // Convert ObjectIds to strings before sending
    const recipeObject = recipe.toObject();
    recipeObject.likes = recipeObject.likes.map((id: any) => id.toString());

    res.status(200).json(recipe);
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
    const recipeId = req.params.id;
    const userId = new Types.ObjectId(req.user._id);

    // Block invalid MongoDB IDs
    if (!mongoose.Types.ObjectId.isValid(recipeId)) {
      return res.status(400).json({ message: "Invalid recipe ID" });
    }
    console.log("incoming recipe id:", req.params._id);

    const recipe = await Recipe.findById(recipeId);

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    const favorites = recipe.favorites as Types.ObjectId[];

    const isFavorited = favorites.some((id) => id.equals(userId));

    if (isFavorited) {
      recipe.favorites = favorites.filter((id) => !id.equals(userId));
    } else {
      recipe.favorites.push(userId);
    }

    const saved = await recipe.save();

    res.status(200).json(saved);
  } catch (error) {
    next(error);
  }
};

export const fetchFavourites = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user._id;

    const favorites = await Recipe.find({
      favorites: userId,
    });

    res.status(200).json(favorites);
  } catch (error) {
    next(error);
  }
};
