import { Recipe } from "../recipes/recipeTypes";
export interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  avatar?: string;
  bio: string;
  followers: string[];
  following: string[];
  recipes: Recipe[];
}

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isFollowing: boolean;
}
