import { Schema, InferSchemaType, model, Types } from "mongoose";

const RecipeSchema = new Schema(
  {
    title: { type: String, required: true },
    ingredients: { type: [String], required: true },
    instructions: { type: [String], required: true },
    description: { type: String, default: "" },
    cookingTime: { type: Number, default: 0 },
    servings: { type: Number, default: 1 },
    image: { type: String, default: "" },
    tags: { type: [String], default: [] },
    createdBy: { type: Types.ObjectId, ref: "User", default: null },
    likes: { type: [Schema.Types.ObjectId], default: [] },
    comments: { type: [Schema.Types.ObjectId], default: [] },
    favorites: { type: [Schema.Types.ObjectId], ref: "User" },
  },
  { timestamps: true }
);

// Automatically infer the TypeScript type from the schema
type RecipeType = InferSchemaType<typeof RecipeSchema>;

export const Recipe = model<RecipeType>("Recipe", RecipeSchema);
