import { createAsyncThunk } from "@reduxjs/toolkit";
import { User } from "./authTypes";
import { AuthState } from "./authTypes";
import { authApi } from "@/lib/api/authApi";
import { AxiosError } from "axios";

// Register user thunk
export const registerUser = createAsyncThunk<
  { user: User; token: string },
  { name: string; email: string; password: string },
  { rejectValue: string }
>("auth/register", async (userData, { rejectWithValue }) => {
  try {
    const user = await authApi.createProfile(userData);

    return user;
  } catch (err: unknown) {
    if (err instanceof Error) {
      return rejectWithValue(err.message);
    }
    return rejectWithValue("Failed to register");
  }
});

// Login user thunk
export const loginUser = createAsyncThunk<
  { user: User; token: string },
  { email: string; password: string },
  { rejectValue: string }
>("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    const response = await authApi.loginUser(credentials);
    return response;
  } catch (err: unknown) {
    if (err instanceof Error) {
      return rejectWithValue(err.message);
    }
    return rejectWithValue("Failed to login");
  }
});

// Google login thunk
export const userGoogleLogin = createAsyncThunk<
  { user: User; token?: string },
  { token: string },
  { rejectValue: string }
>("auth/google", async ({ token }, { rejectWithValue }) => {
  try {
    const response = await authApi.googleLogin(token);
    return response;
  } catch (err: unknown) {
    if (err instanceof Error) {
      return rejectWithValue(err.message);
    }
    return rejectWithValue("Google login failed");
  }
});

// Fetch user profile thunk
export const fetchUserProfile = createAsyncThunk<
  User,
  void,
  { rejectValue: string }
>("auth/user", async (_, { rejectWithValue }) => {
  try {
    const user = await authApi.getUserProfile();
    return user;
  } catch (err: any) {
    if (err.response?.status === 401) {
      return rejectWithValue("UNAUTHORIZED");
    }
    return rejectWithValue("Failed to fetch user profile");
  }
});

export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await authApi.logoutUser();
    } catch (err: unknown) {
      if (err instanceof Error) {
        return rejectWithValue(err.message);
      }
      return rejectWithValue("Logout failed");
    }
  }
);
