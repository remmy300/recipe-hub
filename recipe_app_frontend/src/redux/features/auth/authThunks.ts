import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { User } from "./authTypes";
import { AuthState } from "./authTypes";

//async thunk login

export const loginUser = createAsyncThunk<
  { user: User; token: string }, //expected success type
  { email: string; password: string }, //argument type
  { rejectValue: string } //reject type
>("api/auth/login", async (Credential, { rejectWithValue }) => {
  try {
    const res = await axios.post("api/auth/login", Credential);
    return res.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      return rejectWithValue(err.response?.data?.message);
    }
    return rejectWithValue("Failed to Login");
  }
});

//async thunk : fetchUserProfile

export const fetchUserProfile = createAsyncThunk<
  User,
  void,
  { rejectValue: string; state: { auth: AuthState } }
>("/api/auth/user", async (_, { rejectWithValue, getState }) => {
  const { token } = getState().auth;

  try {
    const res = await axios.get("/api/auth/user", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      return rejectWithValue(err.response?.data?.message);
    }
    return rejectWithValue("Failed to fetch user profile");
  }
});
