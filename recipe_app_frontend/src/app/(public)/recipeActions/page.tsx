"use client";
import { useAppDispatch } from "@/redux/hooks";
import { deleteRecipe } from "@/redux/features/recipes/recipeThunks";
import { toggleFavourite } from "@/redux/features/recipes/recipeThunks";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const RecipeActions = ({ recipeId }: any) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  return (
    <div className="flex gap-8 mt-3">
      <Button
        className="text-sm text-white bg-orange-500 hover:bg-orange-600"
        onClick={() => router.push(`/add-recipe?edit=${recipeId}`)}
      >
        Edit
      </Button>
      <Button
        className="text-sm text-white bg-orange-500 hover:bg-orange-600"
        onClick={() => {
          dispatch(deleteRecipe(recipeId));
          router.push("/");
        }}
      >
        Delete
      </Button>
      <Button
        className="text-sm text-white bg-orange-500 hover:bg-orange-600"
        onClick={() => {
          dispatch(toggleFavourite(recipeId));
          router.push("/");
        }}
      >
        🖤Favourite
      </Button>
    </div>
  );
};

export default RecipeActions;
