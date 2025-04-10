import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User, AuthState, UserProfile } from "../../types";
import { authApi } from "../../api/authApi";
import { clearAuthData, getToken, getUser } from "../../utils/authUtils";
import { authThunks } from "./authThunks";
// import { clearOptimizationParameters } from "../optimization/optimizationSlice";
// import { clearSelectedProduct } from "../product/productSlice";

const initialState: AuthState = {
  user: getUser(),
  token: getToken(),
  isAuthenticated: !!getToken(),
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      clearAuthData();
      authThunks();
      // clearOptimizationParameters();
      // clearSelectedProduct();
    },
    setCredentials: (
      state,
      action: PayloadAction<{ user: UserProfile; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle login success
      .addMatcher(
        authApi.endpoints.login.matchFulfilled,
        (state, { payload }) => {
          state.token = payload.access;
          state.isAuthenticated = true;
          state.error = null;
        }
      )
      // Handle login error
      .addMatcher(
        authApi.endpoints.login.matchRejected,
        (state, { payload }) => {
          // You might need to cast payload if TypeScript can't infer its type correctly
          const errorPayload = payload as { data?: { error?: string } };
          state.error = errorPayload?.data?.error || "Authentication failed";
        }
      );
  },
});

export const { logout, setCredentials } = authSlice.actions;
export default authSlice.reducer;
