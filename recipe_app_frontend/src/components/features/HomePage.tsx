"use client";

import AppSidebar from "../sidebar";
import { RxAvatar } from "react-icons/rx";
import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { fetchRecipes } from "@/redux/features/recipes/recipeThunks";
import Image from "next/image";
import Link from "next/link";

const HomePage = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isClient, setIsClient] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dispatch = useAppDispatch();
  const recipes = useAppSelector((state) => state?.recipes.recipes);
  console.log("logged recipe:", recipes);

  const user = useAppSelector((state) => state.auth.user);

  const getInitials = (nameOrEmail?: string | null) => {
    if (!nameOrEmail) return;
    const s = nameOrEmail.trim();
    const parts = s.split(/\s+/);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (
      parts[0].charAt(0) + parts[parts.length - 1].charAt(0)
    ).toUpperCase();
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

  // get unique category
  const category = [
    "all",
    ...new Set(recipes.map((recipe) => recipe.category)),
  ];

  const filteredData = useMemo(() => {
    return recipes.filter((recipe) => {
      // category filter
      const matchesCategory =
        selectedCategory === "all" || recipe.category === selectedCategory;

      // filter by search query
      const matchesSearchQuery =
        searchQuery === "" ||
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.createdBy?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.ingredients
          .join("")
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearchQuery;
    });
  }, [recipes, searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-white/95 max-w-5xl flex flex-1 flex-col   p-6">
      {/* Sidebar */}
      <AppSidebar />

      {/* Main content area */}
      <div className=" mt">
        {/* Search Section */}
        <div className="flex items-center justify-evenly">
          <div className="w-full max-w-3xl ">
            <Input
              type="text"
              className="w-full h-12 text-base px-5 rounded-md  focus:outline-none focus:ring-2 "
              placeholder="Search recipes, ingredients, or chefs..."
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-end">
            {isClient && user ? (
              <div className="w-10 h-10 rounded-full">
                {getInitials(user.name ?? user.email)}
              </div>
            ) : (
              <RxAvatar size={30} />
            )}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center justify-around gap-3 mt-4">
          <Button
            variant="outline"
            className="rounded-full border-gray-300 text-gray-700 hover:bg-orange-400 "
            onClick={() => setSelectedCategory("all")}
          >
            All
          </Button>

          <Button
            variant="outline"
            className="rounded-full border-gray-300 text-gray-700 hover:bg-orange-400 "
            onClick={() => setSelectedCategory("Lunch")}
          >
            Lunch
          </Button>
          <Button
            variant="outline"
            className="rounded-full border-gray-300 text-gray-700 hover:bg-orange-400 "
            onClick={() => setSelectedCategory("Salad")}
          >
            Salad
          </Button>
          <Button
            variant="outline"
            className="rounded-full border-gray-300 text-gray-700 hover:bg-orange-400 "
            onClick={() => setSelectedCategory("Breakfast")}
          >
            Breakfast
          </Button>
          <Button
            variant="outline"
            className="rounded-full border-gray-300 text-gray-700 hover:bg-orange-400 "
            onClick={() => setSelectedCategory("Dinner")}
          >
            Dinner
          </Button>
          <Button
            variant="outline"
            className="rounded-full border-gray-300 text-gray-700 hover:bg-orange-400 "
            onClick={() => setSelectedCategory("Dessert")}
          >
            Dessert
          </Button>
          <Button
            variant="outline"
            className="rounded-full border-gray-300 text-gray-700 hover:bg-orange-400 "
            onClick={() => setSelectedCategory("Seafood")}
          >
            SeaFoods
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center mt-3">
          {filteredData?.map((recipe) => (
            <Link
              href={`recipes/${recipe._id}`}
              key={recipe._id}
              className="bg-white/95 dark:bg-gray-700 shadow-lg rounded-md overflow-hidden h-full hover:scale-105"
            >
              <Image
                src={
                  recipe.imageUrl
                    ? recipe.imageUrl.startsWith("http")
                      ? recipe.imageUrl //  Cloudinary
                      : recipe.imageUrl // /images/... from public
                    : "/placeholder.webp" //  fallback
                }
                alt={recipe.title}
                width={400}
                height={300}
                className="h-30 w-full object-cover"
                unoptimized
              />

              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{recipe.title}</h3>
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                  {recipe.description}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>⏱️ {recipe.cookingTime} mins</span>
                  <span>👤 {recipe.servings}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
