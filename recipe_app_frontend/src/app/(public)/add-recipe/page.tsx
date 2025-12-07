import React from "react";
import AddRecipeForm from "./addRecipeForm";
import ProtectedRoute from "@/components/shared/ProtectedRoute";

const page = () => {
  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto p-4 h-screen">
        <AddRecipeForm />
      </div>
    </ProtectedRoute>
  );
};

export default page;
