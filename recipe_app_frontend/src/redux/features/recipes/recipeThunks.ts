import { createAsyncThunk } from "@reduxjs/toolkit";
import { recipeApi } from "@/lib/api/recipeApi";
import { CreateRecipePayload } from "./recipeTypes";

import { handleAxiosError } from "@/lib/Error";
import { Recipe } from "./recipeTypes";

export const fetchRecipes = createAsyncThunk<
  Recipe[], //  return type
  void, //  argument type
  { rejectValue: string } // optional reject type
>("/recipe/fetchAll", async (_, { rejectWithValue }) => {
  try {
    return await recipeApi.getAll();
  } catch (err) {
    return handleAxiosError(err, rejectWithValue) as never;
  }
});
export const fetchRecipe = createAsyncThunk<
  Recipe, //  Return type — a single recipe object
  string, //  Argument type — the recipe ID
  { rejectValue: string } //  Reject type
>("/recipe/fetchOne", async (id: string, { rejectWithValue }) => {
  try {
    return await recipeApi.getOne(id);
  } catch (err) {
    return handleAxiosError(err, rejectWithValue) as never;
  }
});
export const updateRecipe = createAsyncThunk(
  "/recipe/update",
  async (
    { id, recipe }: { id: string; recipe: Partial<Recipe> },
    { rejectWithValue }
  ) => {
    try {
      return await recipeApi.update(id, recipe);
    } catch (err) {
      return handleAxiosError(err, rejectWithValue) as never;
    }
  }
);

export const createRecipe = createAsyncThunk(
  "recipe/create",
  async (recipe: CreateRecipePayload, { rejectWithValue }) => {
    try {
      return await recipeApi.create(recipe);
    } catch (error) {
      return handleAxiosError(error, rejectWithValue) as never;
    }
  }
);

export const deleteRecipe = createAsyncThunk<
  { success: boolean; id: string }, // return type
  string, //  argument type
  { rejectValue: string } //  correct reject type
>("recipe/delete", async (id, { rejectWithValue }) => {
  try {
    return await recipeApi.remove(id);
  } catch (error) {
    return handleAxiosError(error, rejectWithValue) as never;
  }
});

export const toggleFavourite = createAsyncThunk<
  Recipe,
  string,
  { rejectValue: string }
>("recipe/favourite", async (id, { rejectWithValue }) => {
  try {
    return await recipeApi.favorite(id);
  } catch (error) {
    return handleAxiosError(error, rejectWithValue) as never;
  }
});

export const toggleLike = createAsyncThunk<
  Recipe,
  string,
  { rejectValue: string }
>("recipe/like", async (id, { rejectWithValue }) => {
  try {
    return await recipeApi.like(id);
  } catch (error) {
    return handleAxiosError(error, rejectWithValue) as never;
  }
});
