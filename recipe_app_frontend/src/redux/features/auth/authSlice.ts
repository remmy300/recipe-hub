import { User } from "./authTypes";
import { createSlice, isAnyOf, PayloadAction } from "@reduxjs/toolkit";
import {
  loginUser,
  fetchUserProfile,
  userGoogleLogin,
  logoutUser,
  toggleFollow,
} from "./authThunks";
import { updateProfileThunk } from "./authThunks";
import { changePasswordThunk, deleteAccountThunk } from "./authThunks";
import { AuthState } from "./authTypes";

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
  isAuthenticated: false,
  isFollowing: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(
      loginUser.fulfilled,
      (state, action: PayloadAction<{ user: User; token: string }>) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;

        if (typeof window !== "undefined") {
          localStorage.setItem("token", action.payload.token);
        }
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
    builder.addCase(
      updateProfileThunk.fulfilled,
      (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      }
    );
    builder.addCase(
      changePasswordThunk.fulfilled,
      (state, action: PayloadAction<{ message: string }>) => {
        state.loading = false;
        // password changed; nothing else to update in state
      }
    );
    builder.addCase(userGoogleLogin.fulfilled, (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token ?? null;
      state.isAuthenticated = true;

      if (action.payload.token) {
        state.token = action.payload.token;
        localStorage.setItem("token", action.payload.token);
      }
    });
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;

      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
      }
    });

    builder.addCase(toggleFollow.fulfilled, (state, action) => {
      state.loading = false;
      state.isFollowing = action.payload.following;
    });

    builder.addCase(deleteAccountThunk.fulfilled, (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
      }
    });

    builder.addMatcher(isAnyOf(fetchUserProfile.rejected), (state, action) => {
      state.loading = false;

      if (action.payload === "UNAUTHORIZED") {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        return;
      }

      state.error = action.payload as string;
    });

    builder.addMatcher(
      isAnyOf(updateProfileThunk.rejected),
      (state, action) => {
        state.loading = false;

        if (action.payload === "UNAUTHORIZED") {
          state.user = null;
          state.token = null;
          state.isAuthenticated = false;
          return;
        }

        state.error = action.payload as string;
      }
    );

    builder.addMatcher(
      isAnyOf(
        loginUser.pending,
        fetchUserProfile.pending,
        userGoogleLogin.pending,
        updateProfileThunk.pending,
        logoutUser.pending,
        changePasswordThunk.pending,
        deleteAccountThunk.pending,
        toggleFollow.pending
      ),
      (state) => {
        state.loading = true;
        state.error = null;
      }
    );

    builder.addMatcher(
      isAnyOf(
        loginUser.rejected,
        userGoogleLogin.rejected,
        updateProfileThunk.rejected,
        logoutUser.rejected,
        changePasswordThunk.rejected,
        deleteAccountThunk.rejected,
        toggleFollow.rejected
      ),
      (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      }
    );
  },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
