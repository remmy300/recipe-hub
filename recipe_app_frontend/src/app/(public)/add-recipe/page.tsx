import React from "react";
import AddRecipeForm from "./addRecipeForm";
import ProtectedRoute from "@/components/shared/ProtectedRoute";

const page = () => {
  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto p-4 h-screen">
        <h1 className="text-xl font-semibold">Add Recipe </h1>
        <AddRecipeForm />
      </div>
    </ProtectedRoute>
  );
};

export default page;
