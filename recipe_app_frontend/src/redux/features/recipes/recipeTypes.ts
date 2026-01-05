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
  tags: string[];
  favorites: string[];
  category?: string;
  createdBy?: string | PopulatedUser;
  createdAt?: string;
  updatedAt?: string;
}

export interface PopulatedUser {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
}

// Used when creating a new recipe (data sent to API)
export interface CreateRecipePayload {
  _id: string;
  title: string;
  ingredients: string[];
  instructions: string[];
  description?: string;
  cookingTime?: number;
  servings?: number;
  imageUrl?: string;
  createdBy?: string | PopulatedUser;
}

//  Used when updating a recipe
export interface UpdateRecipePayload {
  _id: string;
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
