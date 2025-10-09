import { Response, Request } from "express";
import { Recipe } from "../models/Recipe";
import { Comment } from "../models/Comment";

// Extend Express Request interface to include 'user'
declare global {
  namespace Express {
    interface Request {
      user: { _id: string };
    }
  }
}

export const addComment = async (req: Request, res: Response) => {
  try {
    const { id: recipeId } = req.params;
    const userId = req.user._id;
    const { text } = req.body;

    if (!text) return res.json({ message: "Comment text required" });
    //check if the recipe by id exists
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });

    //Create the comment
    const comment = await Comment.create({
      userId,
      recipeId,
      text,
    });
    //link comment Id  back to the recipe
    recipe.comments.push(comment._id);
    await recipe.save();

    res.status(201).json(recipe);
  } catch (error) {
    res.status(500).json({ message: "Error adding comment", error });
  }
};

export const getCommentForRecipe = async (req: Request, res: Response) => {
  try {
    const comments = await Comment.find({ recipeId: req.params.recipeId })
      .populate("userId", "name,avatar")
      .sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: "error fetching all comments", error });
  }
};

export const deleteCommentForRecipe = async (req: Request, res: Response) => {
  try {
    const deleteComment = await Comment.findByIdAndDelete(req.params.id);

    res.status(200).json(deleteComment);
  } catch (error) {
    res.status(500).json({ message: "Comment not found" });
  }
};
