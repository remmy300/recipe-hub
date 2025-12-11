import {
  Recipe,
  CreateRecipePayload,
} from "@/redux/features/recipes/recipeTypes";
import api from "./api";

export const recipeApi = {
  getAll: async (): Promise<Recipe[]> => {
    const res = await api.get<Recipe[]>("/api/recipes");
    if (res.status < 200 || res.status >= 300)
      throw new Error("Failed to fetch recipe data");
    return res.data;
  },

  create: async (recipe: CreateRecipePayload): Promise<Recipe> => {
    const res = await api.post<Recipe>("/api/recipes", recipe, {
      withCredentials: true,
    });
    console.log("Created recipe:", res);

    return res.data;
  },

  getOne: async (id: string): Promise<Recipe> => {
    const res = await api.get(`/api/recipes/${id}`);
    if (res.status < 200 || res.status >= 300)
      throw new Error("failed to get the recipe data by ID");
    return res.data;
  },

  update: async (id: string, recipe: Partial<Recipe>): Promise<Recipe> => {
    const res = await api.put(`/api/recipes/${id}`, recipe);
    if (res.status < 200 || res.status >= 300)
      throw new Error("failed to update the recipe");
    return res.data;
  },

  remove: async (id: string): Promise<{ success: boolean; id: string }> => {
    const res = await api.delete(`api/recipes/${id}`);
    if (res.status < 200 || res.status >= 300)
      throw new Error("failed to delete the recipe");
    return res.data;
  },
  favorite: async (id: string): Promise<Recipe> => {
    const res = await api.post(`/api/recipes/${id}/favorite`, null, {
      withCredentials: true,
    });
    return res.data;
  },
  like: async (id: string): Promise<Recipe> => {
    const res = await api.post(`/api/recipes/${id}/like`, null, {
      withCredentials: true,
    });
    return res.data;
  },
  getFavorites: async (): Promise<Recipe[]> => {
    const res = await api.get("/api/recipes/favorites", {
      withCredentials: true,
    });
    if (res.status < 200 || res.status >= 300)
      throw new Error("Failed to fetch favorite recipe data");
    return res.data;
  },
};
