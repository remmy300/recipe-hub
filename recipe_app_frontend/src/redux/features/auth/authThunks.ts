import { createAsyncThunk } from "@reduxjs/toolkit";
import { User } from "./authTypes";
import { authApi } from "@/lib/api/authApi";

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

export const toggleFollow = createAsyncThunk<
  { following: boolean },
  //return type
  string, //argument type
  { rejectValue: string }
>("followToggle", async (targetUserId, { rejectWithValue }) => {
  try {
    return await authApi.followToggle(targetUserId);
  } catch (err: unknown) {
    if (err instanceof Error) {
      return rejectWithValue(err.message);
    }
    return rejectWithValue("Failed to follow");
  }
});

export const updateProfileThunk = createAsyncThunk<
  User,
  { name?: string; bio?: string; avatar?: string },
  { rejectValue: string }
>("auth/updateProfile", async (data, { rejectWithValue }) => {
  try {
    const updated = await authApi.updateProfile(data);
    return updated;
  } catch (err: any) {
    if (err.response?.status === 401) {
      return rejectWithValue("UNAUTHORIZED");
    }
    if (err instanceof Error) {
      return rejectWithValue(err.message);
    }
    return rejectWithValue("Failed to update profile");
  }
});

export const changePasswordThunk = createAsyncThunk<
  { message: string },
  { oldPassword: string; newPassword: string },
  { rejectValue: string }
>("auth/changePassword", async (payload, { rejectWithValue }) => {
  try {
    const res = await authApi.changePassword(payload);
    return res;
  } catch (err: any) {
    if (err.response?.status === 401) {
      return rejectWithValue("UNAUTHORIZED");
    }
    if (err instanceof Error) {
      return rejectWithValue(err.message);
    }
    return rejectWithValue("Failed to change password");
  }
});

export const deleteAccountThunk = createAsyncThunk<
  { message: string },
  void,
  { rejectValue: string }
>("auth/deleteAccount", async (_, { rejectWithValue }) => {
  try {
    const res = await authApi.deleteAccount();
    return res;
  } catch (err: unknown) {
    if (err instanceof Error) {
      return rejectWithValue(err.message);
    }
    if (
      typeof err === "object" &&
      err !== null &&
      "response" in err &&
      (err as any).response?.status === 401
    ) {
      return rejectWithValue("UNAUTHORIZED");
    }
    return rejectWithValue("Failed to delete account");
  }
});

//Async thunks in Redux Toolkit are strongly typed by explicitly declaring the argument and return types, ensuring predictable state updates and safer async logic.
