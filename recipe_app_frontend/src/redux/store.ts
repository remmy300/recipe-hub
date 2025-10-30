import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import authReducer from "./features/auth/authSlice";

//function to load token from local storage

const loadState = () => {
  try {
    const serializedState = localStorage.getItem("reduxState");
    if (!serializedState) return undefined;
    return JSON.parse(serializedState);
  } catch (err) {
    console.error("could not load the state", err);
  }
};
export const store = configureStore({
  reducer: combineReducers({
    auth: authReducer,
  }),

  preloadedState: typeof window !== "undefined" ? loadState() : undefined, //prehydrate on client
});

// save redux state on localStorage on change

store.subscribe(() => {
  try {
    const stateToSave = {
      auth: {
        user: store.getState().auth.user,
        token: store.getState().auth.token,
        isAuthenticated: store.getState().auth.isAuthenticated,
      },
    };
    localStorage.setItem("reduxState", JSON.stringify(stateToSave));
  } catch (err) {
    console.error("Failed to save state", err);
  }
});

//infer types from the store
export type RootState = ReturnType<typeof store.getState>; //entire redux state tree
export type AppDispatch = typeof store.dispatch; //stores dispatch function type
