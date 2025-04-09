// src/services/authApi.ts

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AuthCredentials, AuthResponse, RegisterRequest, User } from "../types";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8000/auth/" }),
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, AuthCredentials>({
      query: (credentials) => ({
        url: "login/",
        method: "POST",
        body: credentials,
      }),
    }),
    register: builder.mutation<User, RegisterRequest>({
      query: (userData) => ({
        url: "register/",
        method: "POST",
        body: userData,
      }),
    }),
    refreshToken: builder.mutation<{ access: string }, { refresh: string }>({
      query: (refreshData) => ({
        url: "refresh/",
        method: "POST",
        body: refreshData,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useRefreshTokenMutation,
} = authApi;
