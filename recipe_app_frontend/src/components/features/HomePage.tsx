"use client";

import AppSidebar from "../sidebar";
import React, { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { fetchRecipes } from "@/redux/features/recipes/recipeThunks";
import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toggleLike } from "@/redux/features/recipes/recipeThunks";
import { Card } from "../ui/card";

const HomePage = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isClient, setIsClient] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dispatch = useAppDispatch();
  const recipes = useAppSelector((state) => state?.recipes.recipes);

  const user = useAppSelector((state) => state.auth.user);

  const getInitials = (nameOrEmail?: string | null) => {
    if (!nameOrEmail) return "";
    const s = nameOrEmail.trim();
    const parts = s.split(/\s+/);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (
      parts[0].charAt(0) + parts[parts.length - 1].charAt(0)
    ).toUpperCase();
  };

  const handleLike = (recipeId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleLike(recipeId));
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    dispatch(fetchRecipes());
  }, [dispatch]);

  useEffect(() => {
    if (user === null) return;
  }, [user]);

  const filteredData = useMemo(() => {
    return recipes.filter((recipe) => {
      const matchesCategory =
        selectedCategory === "all" || recipe.category === selectedCategory;

      const createdByText =
        typeof recipe.createdBy === "string"
          ? recipe.createdBy
          : recipe.createdBy?.name ?? "";
      const matchesSearchQuery =
        searchQuery === "" ||
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        createdByText?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.ingredients
          .join("")
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearchQuery;
    });
  }, [recipes, searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-white/95 flex flex-col ">
      {/* Sidebar */}
      <AppSidebar />

      {/* Main content area */}
      <div className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="max-w-7xl mx-auto">
          {/* Search Section */}
          <div className="flex  items-center gap-4 sm:gap-6 mb-6">
            <div className="w-full sm:flex-1">
              <Input
                type="text"
                className="w-full h-12 text-base px-5 rounded-md focus:outline-none focus:ring-2"
                placeholder="Search recipes, ingredients, or chefs..."
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Link href="/profile" className="flex items-center shrink-0">
              {isClient && user && user.avatar ? (
                <div className="relative w-10 h-10 overflow-hidden rounded-full bg-gray-300">
                  <Image
                    src={user.avatar}
                    alt={user.name}
                    fill
                    priority
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-sm font-semibold">
                  {getInitials(user?.name ?? user?.email)}
                </div>
              )}
            </Link>
          </div>

          {/* Filter Tabs - Horizontal scroll on mobile */}
          <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-2 mb-6 scrollbar-hide">
            <Button
              variant="outline"
              className="rounded-full border-gray-300 text-gray-700 hover:bg-orange-400 whitespace-nowrap px-4 sm:px-6"
              onClick={() => setSelectedCategory("all")}
            >
              All
            </Button>
            <Button
              variant="outline"
              className="rounded-full border-gray-300 text-gray-700 hover:bg-orange-400 whitespace-nowrap px-4 sm:px-6"
              onClick={() => setSelectedCategory("Lunch")}
            >
              Lunch
            </Button>
            <Button
              variant="outline"
              className="rounded-full border-gray-300 text-gray-700 hover:bg-orange-400 whitespace-nowrap px-4 sm:px-6"
              onClick={() => setSelectedCategory("Salad")}
            >
              Salad
            </Button>
            <Button
              variant="outline"
              className="rounded-full border-gray-300 text-gray-700 hover:bg-orange-400 whitespace-nowrap px-4 sm:px-6"
              onClick={() => setSelectedCategory("Breakfast")}
            >
              Breakfast
            </Button>
            <Button
              variant="outline"
              className="rounded-full border-gray-300 text-gray-700 hover:bg-orange-400 whitespace-nowrap px-4 sm:px-6"
              onClick={() => setSelectedCategory("Dinner")}
            >
              Dinner
            </Button>
            <Button
              variant="outline"
              className="rounded-full border-gray-300 text-gray-700 hover:bg-orange-400 whitespace-nowrap px-4 sm:px-6"
              onClick={() => setSelectedCategory("Dessert")}
            >
              Dessert
            </Button>
            <Button
              variant="outline"
              className="rounded-full border-gray-300 text-gray-700 hover:bg-orange-400 whitespace-nowrap px-4 sm:px-6"
              onClick={() => setSelectedCategory("Seafood")}
            >
              SeaFoods
            </Button>
          </div>

          {/* Recipe Grid - Responsive columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredData?.map((recipe) => {
              return (
                <Card
                  key={recipe._id}
                  className="p-0 overflow-hidden shadow-md hover:scale-105 transition-transform"
                >
                  <Link
                    href={`recipes/${recipe._id}`}
                    className="relative block"
                  >
                    <button
                      onClick={(e) => handleLike(recipe._id, e)}
                      className="absolute top-2 right-2 z-10 bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-all hover:scale-110 shadow-md"
                    >
                      <Heart
                        className={`w-5 h-5 transition-colors ${
                          user?._id && recipe.likes.includes(user?._id)
                            ? "fill-red-500 text-red-500"
                            : "text-gray-600"
                        }`}
                      />
                    </button>
                    <div className="rounded-t-lg overflow-hidden">
                      <div className="relative aspect-[4/3]">
                        <Image
                          src={recipe.imageUrl || "/placeholder.webp"}
                          alt={recipe.title}
                          fill
                          className="object-cover"
                          priority
                        />
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-1">
                        {recipe.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {recipe.description}
                      </p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>⏱️ {recipe.cookingTime} mins</span>
                        <span>👤 {recipe.servings}</span>
                      </div>
                    </div>
                  </Link>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
