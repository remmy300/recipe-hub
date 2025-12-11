import { StaticImport } from "next/dist/shared/lib/get-img-props";

// Represents a single recipe
export interface Recipe {
  _id: string;
  title: string;
  ingredients: string[];
  instructions: string[];
  description?: string;
  cookingTime?: number;
  servings?: number;
  imageUrl?: string;
  likes: string[];
  favorites: string[];
  category?: string;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Used when creating a new recipe (data sent to API)
export interface CreateRecipePayload {
  title: string;
  ingredients: string[];
  instructions: string[];
  description?: string;
  cookingTime?: number;
  servings?: number;
  imageUrl?: string;
}

//  Used when updating a recipe
export interface UpdateRecipePayload {
  title?: string;
  ingredients?: string[];
  instructions?: string[];
  description?: string;
  cookingTime?: number;
  servings?: number;
  imageUrl?: string;
}

//  Used for API responses (e.g., from /api/recipes)
export interface RecipeResponse {
  success: boolean;
  message?: string;
  data: Recipe | Recipe[];
}
