// src/features/auth/authSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState, UserProfile } from "../../types";

// Function to load state from localStorage
const loadAuthState = (): AuthState => {
  try {
    const serializedToken = localStorage.getItem("token");
    const serializedUser = localStorage.getItem("user");

    if (serializedToken && serializedUser) {
      return {
        token: JSON.parse(serializedToken),
        user: JSON.parse(serializedUser),
        isAuthenticated: true,
        error: null,
        loading: false,
      };
    }
  } catch (e) {
    console.log("Error loading auth state from localStorage", e);
  }

  return {
    token: null,
    user: null,
    isAuthenticated: false,
    error: null,
    loading: false,
  };
};

// Initial state with loaded data from localStorage
const initialState: AuthState = loadAuthState();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (
      state,
      action: PayloadAction<{ token: string; user: UserProfile }>
    ) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.user = action.payload.user;

      // Save to localStorage
      localStorage.setItem("token", JSON.stringify(action.payload.token));
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      state.error = null;

      // Clear localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    updateToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;

      // Update localStorage
      localStorage.setItem("token", JSON.stringify(action.payload));
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, updateToken } =
  authSlice.actions;

export default authSlice.reducer;
