"use client";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import api from "@/lib/api/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { useSearchParams } from "next/navigation";
import { fetchRecipe } from "@/redux/features/recipes/recipeThunks";

type FormValues = {
  title: string;
  description: string;
  instructions: string;
  category: string;
  cookingTime: string | number;
  servings: string | number;
  ingredients: string;
  tags?: string;
  imageUrl?: FileList;
};

type FieldConfig =
  | {
      name: keyof FormValues;
      label: string;
      type: "text" | "number" | "file" | "textarea";
    }
  | {
      name: keyof FormValues;
      label: string;
      type: "select";
      options: string[];
    };

const AddRecipeForm = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const { register, handleSubmit, reset } = useForm<FormValues>();
  const recipe = useAppSelector((state) => state.recipes.recipe);

  const user = useAppSelector((state) => state.auth.user);

  if (!user) {
    router.replace("/login");
  }

  useEffect(() => {
    if (editId) {
      dispatch(fetchRecipe(editId));
    }
  }, [editId, dispatch]);

  useEffect(() => {
    if (recipe && editId) {
      reset({
        title: recipe.title,
        description: recipe.description ?? "",
        instructions: recipe.instructions.join(","),
        ingredients: recipe.ingredients.join(","),
        tags: recipe.tags?.join(",") ?? "",
        servings: recipe.servings ?? 0,
        cookingTime: recipe.cookingTime ?? 0,
        category: recipe.category || "",
      });

      if (recipe.imageUrl) {
        setImagePreview(recipe.imageUrl);
      }
    }
  }, [recipe, editId, reset]);

  const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  // Recipe mutation
  const createMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await api.post("/api/recipes", formData, {
        withCredentials: true,
      });
      return res.data;
    },
    onSuccess: () => {
      alert("Recipe uploaded succesfully");
      router.push("/");
    },
    onError: (err: any) => {
      console.log(err);
      alert(err.response?.data?.message || "Recipe upload failed");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: FormData }) => {
      const res = await api.put(`/api/recipes/${id}`, data, {
        withCredentials: true,
      });
      return res.data;
    },
    onSuccess: () => {
      alert("Recipe updated successfully");
      router.push(`/recipes/${editId}`);
    },
  });

  console.log("EDIT ID:", editId);
  console.log("REDUX RECIPE:", recipe);

  const onSubmit = (data: FormValues) => {
    const form = new FormData();
    form.append("title", data.title);
    form.append("description", data.description);
    form.append("instructions", JSON.stringify(data.instructions.split(",")));
    form.append("category", data.category);
    form.append("cookingTime", String(data.cookingTime));
    form.append("servings", String(data.servings));
    form.append("ingredients", JSON.stringify(data.ingredients.split(",")));
    form.append("tags", JSON.stringify((data.tags || "").split(",")));
    if (data?.imageUrl?.[0]) form.append("image", data.imageUrl[0]);
    if (editId) {
      updateMutation.mutate({ id: editId, data: form });
    } else {
      createMutation.mutate(form);
    }
  };

  const formFields: FieldConfig[] = [
    { name: "title", label: "Recipe Title", type: "text" },
    { name: "description", label: "Description", type: "textarea" },
    { name: "instructions", label: "Instructions", type: "textarea" },
    { name: "ingredients", label: "Ingredients", type: "text" },
    { name: "tags", label: "Tags", type: "text" },
    { name: "servings", label: "Servings", type: "text" },
    { name: "cookingTime", label: "CookingTime", type: "text" },
    {
      name: "category",
      label: "Category",
      type: "select",
      options: ["Breakfast", "Lunch", "Dinner", "Soup", "Dessert"],
    },
    { name: "imageUrl", label: "Upload Image", type: "file" },
  ];

  return (
    <>
      <h1 className="text-xl font-semibold">
        {editId ? "Update recipe" : "Create recipe"}
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full p-6 mx-auto space-y-4"
      >
        {formFields.map((field) => {
          if (field.type === "text") {
            return (
              <div key={field.name} className="w-full">
                <label className="block text-sm font-medium mb-2">
                  {capitalize(field.label)}
                </label>
                <input
                  className="w-full border-2 border-gray-200 rounded-md p-2 focus:outline-none focus:border-orange-400"
                  type={field.type}
                  {...register(field.name)}
                  onChange={(e) => {
                    if (field.type === "file") {
                      const file = e.target.files?.[0];
                      if (file) setImagePreview(URL.createObjectURL(file));
                    }
                  }}
                />
              </div>
            );
          }

          if (field.type === "textarea") {
            return (
              <div key={field.name} className="w-full">
                <label className="block text-sm font-medium mb-2">
                  {capitalize(field.label)}
                </label>
                <textarea
                  {...register(field.name)}
                  className="w-full p-2 border-2 border-gray-200 rounded-md focus:outline-none focus:border-orange-400 resize-none"
                  rows={4}
                />
              </div>
            );
          }

          if (field.type === "select") {
            return (
              <div key={field.name} className="w-full">
                <label className="block text-sm font-medium mb-2">
                  {capitalize(field.label)}
                </label>
                <select
                  {...register(field.name)}
                  className="w-full p-2 border-2 border-gray-200 rounded-md focus:outline-none focus:border-orange-400"
                >
                  <option value="">Select {field.label}</option>
                  {field.options?.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            );
          }

          if (field.type === "file") {
            return (
              <div key={field.name} className="w-full">
                <label className="block text-sm font-medium mb-2">
                  {capitalize(field.label)}
                </label>
                <input
                  className="w-full border-2 border-gray-200 rounded-md p-2 focus:outline-none focus:border-orange-400"
                  type="file"
                  accept="image/*"
                  {...register(field.name)}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setImagePreview(URL.createObjectURL(file));
                  }}
                />
              </div>
            );
          }
        })}

        {imagePreview && (
          <div className="w-full">
            <Image
              alt="Preview"
              src={imagePreview}
              width={400}
              height={300}
              className="object-cover overflow-hidden rounded-md"
            />
          </div>
        )}

        <Button type="submit" className="w-full rounded-md hover:bg-orange-400">
          {editId ? "Update recipe" : "Create recipe"}
        </Button>
      </form>
    </>
  );
};

export default AddRecipeForm;
