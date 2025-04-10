// src/api/authApi.ts
import { apiSlice } from "./apiSlice";
import { LoginRequest, LoginResponse } from "../types";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Login endpoint
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login/",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["User"], // Ensures cache invalidation when login succeeds
    }),

    // Refresh token
    refreshToken: builder.mutation<{ access: string }, void>({
      query: () => ({
        url: "/auth/refresh/",
        method: "POST",
      }),
    }),

    logout: builder.mutation<{ detail: string }, void>({
      query: () => ({
        url: "/auth/logout/",
        method: "POST",
      }),
    }),
  }),
});

export const { useLoginMutation, useRefreshTokenMutation, useLogoutMutation } =
  authApi;
