"use client";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import Image from "next/image";
import { useEffect } from "react";
import { fetchFavourites } from "@/redux/features/recipes/recipeThunks";
import { Heart } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";

const FavoritePage = () => {
  const dispatch = useAppDispatch();
  const { favorites, loading } = useAppSelector((state) => state.recipes);

  useEffect(() => {
    dispatch(fetchFavourites());
  }, [dispatch]);

  if (loading) return <p>Loading favorite recipes</p>;

  if (favorites.length === 0)
    return (
      <p className="text-xl text-center">
        You have no saved favorite recipe yet
      </p>
    );
  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-semibold">Favorite recipes</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {favorites.map((recipe) => (
          <Card key={recipe._id} className="shadow-md p-0 ">
            <Link href={`/recipes/${recipe._id}`}>
              <Image
                src={recipe.imageUrl || "/placeholder.png"}
                alt={recipe.title}
                height={300}
                width={400}
                unoptimized
                className="h-48 w-full object-cover mt-0 rounded-t-md"
              />
            </Link>
            <div className="p-4">
              <h1 className="text-lg mt-2 font-semibold">{recipe.title}</h1>
              <h2 className="mt-2 text-md">{recipe.description}</h2>
              <div className="flex justify-between items-center mt-3 gap-4">
                <span className="text-sm">{recipe.cookingTime}mins</span>
                <span className="text-sm">{recipe.servings}</span>
                <span className="bg-orange-500 text-md font-semibold text-nowrap">
                  <Heart className="" /> Favorite
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FavoritePage;
