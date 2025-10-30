import { User } from "./authTypes";
import { createSlice, isAnyOf, PayloadAction } from "@reduxjs/toolkit";
import { loginUser, fetchUserProfile } from "./authThunks";
import { AuthState } from "./authTypes";

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logOut: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },

  extraReducers: (builder) => {
    builder.addMatcher(
      isAnyOf(loginUser.pending, fetchUserProfile.pending),
      (state) => {
        state.loading = true;
        state.error = null;
      }
    );

    builder.addMatcher(
      isAnyOf(loginUser.rejected, fetchUserProfile.rejected),
      (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      }
    );

    builder.addCase(
      loginUser.fulfilled,
      (state, action: PayloadAction<{ user: User; token: string }>) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      }
    );

    builder.addCase(
      fetchUserProfile.fulfilled,
      (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      }
    );
  },
});

export const { logOut } = authSlice.actions;
export default authSlice.reducer;
