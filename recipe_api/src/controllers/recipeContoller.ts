import { Request, Response } from "express";
import { Recipe } from "../models/Recipe";

// Fetch all recipes from the DB
export const getRecipes = async (req: Request, res: Response) => {
  try {
    const recipes = await Recipe.find().sort({ createdAt: -1 }); //show newest  first
    res.json(recipes);
  } catch (error) {
    console.log("Error fetching recipes data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Fetch a single recipe by its unique Id
export const getRecipe = async (req: Request, res: Response) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    res.json(recipe);
  } catch (error) {
    console.log("Error fetching a recipe data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update an existing recipe by Id
export const updateRecipe = async (req: Request, res: Response) => {
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
  }
};

// Create and saves  a new recipe
export const createRecipe = async (req: Request, res: Response) => {
  try {
    const newRecipe = new Recipe(req.body);
    const saved = await newRecipe.save();
    res.status(201).json(saved);
  } catch (error) {
    console.log("Error creating new recipe data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a recipe by its Id
export const deleteRecipe = async (req: Request, res: Response) => {
  try {
    const deletedRecipe = await Recipe.findByIdAndDelete(req.params.id);
    res.json(deletedRecipe);
    res.status(204).end();
  } catch (error) {
    console.log("Error deleting recipe data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
