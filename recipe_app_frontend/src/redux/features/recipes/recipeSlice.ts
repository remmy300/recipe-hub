import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Recipe } from "./recipeTypes";
import {
  createRecipe,
  deleteRecipe,
  fetchRecipe,
  fetchRecipes,
  updateRecipe,
  toggleLike,
  toggleFavourite,
  fetchFavourites,
} from "./recipeThunks";
import { act } from "react";

interface recipeState {
  recipes: Recipe[];
  favorites: Recipe[];
  recipe: Recipe | null;
  selectedRecipe: Recipe | null;
  loading: boolean;
  error: string | null;
}

const initialState: recipeState = {
  recipes: [],
  favorites: [],
  recipe: null,
  selectedRecipe: null,
  loading: false,
  error: null,
};

const recipeSlice = createSlice({
  name: "recipes",
  initialState,
  reducers: {
    clearSelectedRecipe: (state) => {
      state.selectedRecipe = null;
    },
    updateRecipeOptimistically: (state, action: PayloadAction<Recipe>) => {
      const index = state.recipes.findIndex(
        (r) => r._id === action.payload._id
      );
      if (index !== -1) {
        state.recipes[index] = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    //get all recipes

    builder.addCase(fetchRecipes.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      fetchRecipes.fulfilled,
      (state, action: PayloadAction<Recipe[]>) => {
        state.loading = false;
        state.recipes = action.payload;
      }
    );

    builder.addCase(fetchRecipes.rejected, (state, action) => {
      state.loading = false;
      state.error = (action.payload as string) || "Failed to fetch recipes";
    });

    //Fetch recipes by ID
    builder.addCase(fetchRecipe.fulfilled, (state, action) => {
      state.selectedRecipe = action.payload;
      state.recipe = action.payload;
    });

    //create a new recipe
    builder.addCase(
      createRecipe.fulfilled,
      (state, action: PayloadAction<Recipe>) => {
        state.recipes.unshift(action.payload); //adds a new recipe on top of the list and puts it first
      }
    );

    //update recipe
    builder.addCase(updateRecipe.fulfilled, (state, action) => {
      const index = state.recipes.findIndex(
        (r) => r._id === action.payload._id
      ); //finds the existing recipe in the array by its id
      if (index !== -1) state.recipes[index] = action.payload; //replaces it with the updated recipe object returned from the api
    });

    //delete recipe
    builder.addCase(deleteRecipe.fulfilled, (state, action) => {
      state.recipes = state.recipes.filter((r) => r._id !== action.payload.id);
    });
    //  Handle toggleLike
    builder.addCase(toggleLike.fulfilled, (state, action) => {
      // Find and update the recipe in the state
      const index = state.recipes.findIndex(
        (recipe) => recipe._id === action.payload._id
      );

      if (index !== -1) {
        state.recipes[index] = action.payload; //  Replace with updated recipe
      } else {
        console.log("Recipe not found in state");
      }
    });
    builder.addCase(toggleLike.rejected, (state, action) => {
      console.error("Like failed:", action.payload);
    });

    //fetch favorites
    builder.addCase(fetchFavourites.fulfilled, (state, action) => {
      state.loading = false;
      state.favorites = action.payload;
    });
    builder.addCase(fetchFavourites.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    //toggle favourite
    builder.addCase(toggleFavourite.fulfilled, (state, action) => {
      const id = action.payload._id;

      const exists = state.favorites.find((r) => r._id === id);

      if (exists) {
        state.favorites = state.favorites.filter((r) => r._id !== id);
      } else {
        const recipe = state.recipes.find((r) => r._id === id);

        if (recipe) {
          state.favorites.push(recipe );
        }
      }
    });
  },
});

export default recipeSlice.reducer;
export const { clearSelectedRecipe, updateRecipeOptimistically } =
  recipeSlice.actions;

//Key Takeaways

//The API defines what your thunk returns.

//The thunk defines what your reducer receives.

//The reducer defines what your component reads.

//TypeScript connects all three — if one breaks, TypeScript immediately warns you.
