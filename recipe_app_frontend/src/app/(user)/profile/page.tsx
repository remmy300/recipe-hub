"use client";
import React, { useEffect } from "react";
import type { PopulatedUser } from "@/redux/features/recipes/recipeTypes";
import Image from "next/image";
import { fetchUserProfile } from "@/redux/features/auth/authThunks";
import { useAppSelector } from "@/redux/hooks";
import { useAppDispatch } from "@/redux/hooks";
import { getUserRecipes } from "@/redux/features/recipes/recipeThunks";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const UserProfile = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const recipes = useAppSelector((state) => state.recipes.recipes);

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  useEffect(() => {
    if (!user?._id) return;
    dispatch(getUserRecipes(user?._id));
  }, [dispatch, user?._id]);

  const userRecipes = recipes.filter((recipe) => {
    if (!user?._id) return false;
    const cb = recipe.createdBy;
    if (typeof cb === "string") return cb === user._id;
    const isPopulatedUser = (v: any): v is PopulatedUser =>
      !!v && typeof v === "object" && "_id" in v;
    if (isPopulatedUser(cb)) return cb._id === user._id;
    return false;
  });
  console.log("created user recipes:", userRecipes);

  return (
    <div className="max-w-3xl mx-auto h-screen p-6">
      <div className=" relative flex items-center gap-4">
        {user?.avatar ? (
          <div className="relative w-24 h-24 rounded-full overflow-hidden flex-shrink-0">
            <Image
              src={user.avatar}
              alt={user.name}
              fill
              className="object-cover"
              priority
            />
          </div>
        ) : (
          <div>
            {user?.name
              ? user?.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
              : "U"}
          </div>
        )}

        <div>
          <h1 className="text-xl font-semibold  mb-2">{user?.name}</h1>
          <p className="text-md mt-3">{user?.bio || "No bio yet"}</p>
        </div>
      </div>
      {/* Stats */}
      <div className="flex gap-8 mt-6 text-center">
        <div>
          <p className="text-xl font-bold">{(user?.followers || []).length}</p>
          <span className="text-gray-900">Followers</span>
        </div>

        <div>
          <p className="text-xl font-bold">{(user?.following || []).length}</p>
          <span className="text-gray-900">Following</span>
        </div>

        <div>
          <p className="text-xl font-bold">{userRecipes.length}</p>
          <span className="text-gray-900">Recipes</span>
        </div>
        <div>
          <Button
            className="rounded-sm"
            onClick={() => {
              router.push("/profile/edit");
            }}
          >
            Edit Profile
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-3">Recipes by {user?.name}</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
          {userRecipes.length > 0 ? (
            userRecipes.map((recipe) => (
              <div
                key={recipe._id}
                className="shadow rounded-lg overflow-hidden"
              >
                <div className="relative h-40 w-full">
                  <Image
                    src={recipe?.imageUrl || "/placeholder.webp"}
                    alt={recipe.title}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="p-3 text-lg font-medium">
                  {recipe.title}
                  <p>{recipe.description}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-lg  text-center">No recipes added yet!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
