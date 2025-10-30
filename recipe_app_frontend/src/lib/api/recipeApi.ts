import {
  Recipe,
  CreateRecipePayload,
} from "@/redux/features/recipes/recipeTypes";
import axios from "axios";

export const recipeApi = {
  getAll: async (): Promise<Recipe[]> => {
    const res = await axios.get<Recipe[]>("/api/recipes");
    if (res.status < 200 || res.status >= 300)
      throw new Error("Failed to fetch recipe data");
    return res.data;
  },

  create: async (recipe: CreateRecipePayload): Promise<Recipe> => {
    const res = await axios.post<Recipe>("/api/recipes", recipe);
    return res.data;
  },

  getOne: async (id: string): Promise<Recipe> => {
    const res = await axios.get(`/api/recipes/${id}`);
    if (res.status < 200 || res.status >= 300)
      throw new Error("failed to get the recipe data by ID");
    return res.data;
  },

  update: async (id: string, recipe: Partial<Recipe>): Promise<Recipe> => {
    const res = await axios.post(`/api/recipe/${id}`, recipe);
    if (res.status < 200 || res.status >= 300)
      throw new Error("failed to update the recipe");
    return res.data;
  },

  remove: async (id: string): Promise<{ success: boolean; id: string }> => {
    const res = await axios.delete(`/api/recipe/${id}`);
    if (res.status < 200 || res.status >= 300)
      throw new Error("failed to delete the recipe");
    return res.data;
  },
};
