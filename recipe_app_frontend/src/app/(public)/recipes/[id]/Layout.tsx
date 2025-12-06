"use client";
import { useAppSelector } from "@/redux/hooks";
import Image from "next/image";
import ProtectedRoute from "@/components/shared/ProtectedRoute";
import { useParams } from "next/navigation";
import RecipeActions from "../../recipeActions/page";

const RecipeDetails = () => {
  const { id } = useParams();
  const recipe = useAppSelector((state) =>
    state.recipes.recipes.find((r) => r._id === id)
  );

  if (!recipe) return <p>Loading recipe....</p>;

  return (
    <ProtectedRoute>
      <div className="max-w-3xl p-3 mx-auto">
        <Image
          src={recipe.imageUrl || "/placeholder.webp"}
          alt={recipe.title}
          height={300}
          width={400}
          className="h-auto w-full object-cover"
          unoptimized
        />

        <p className="text-xl font-semibold pt-2">{recipe.title}</p>
        <p className="text-lg pt-2 ">{recipe.description}</p>

        <div className="flex gap-2 mb-2">
          <span>⏱ {recipe.cookingTime} mins</span>
          <span>👤 {recipe.servings}</span>
          <span>📂 {recipe.category}</span>
        </div>
        <h2 className="text-xl font-semibold mt-2 pb-2">Ingredients</h2>
        <ul className="list-decimal ml-2">
          {recipe.ingredients.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>

        <h2 className="text-xl font-semibold mb-2">Instructions</h2>
        <ol className="list-decimal ml-6">
          {recipe.instructions.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
        <RecipeActions recipeId={recipe._id} />
      </div>
    </ProtectedRoute>
  );
};

export default RecipeDetails;
