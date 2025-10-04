import { Schema, InferSchemaType, model, Types } from "mongoose";

const commentSchema = new Schema(
  {
    userId: { type: Types.ObjectId, default: "" },
    recipeId: { type: Types.ObjectId, required: true },
    text: { type: String, required: true },
  },
  { timestamps: true }
);

type commentType = InferSchemaType<typeof commentSchema>;

export const Comment = model<commentType>("Comment", commentSchema);
