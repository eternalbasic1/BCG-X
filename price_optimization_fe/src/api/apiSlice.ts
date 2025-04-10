import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getToken } from "../utils/authUtils";

const baseUrl = "http://127.0.0.1:8000/";

const baseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers, api) => {
    const extra = api?.extra as { skipAuth?: boolean };

    if (extra?.skipAuth) {
      return headers;
    }

    const token = getToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
  credentials: "include",
});

// Create a customized fetch base query that handles token refresh
const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  let result = await baseQuery(args, api, extraOptions);

  // Handle token expiration
  if (result.error && result.error.status === 401) {
    // Try to refresh token by injecting the skipAuth flag into api.extra
    const refreshResult = await baseQuery(
      {
        url: "/auth/refresh/",
        method: "POST",
      },
      {
        ...api,
        extra: { ...api.extra, skipAuth: true },
      },
      extraOptions
    );

    if (refreshResult.data) {
      // Store the new token
      const { access } = refreshResult.data as { access: string };
      localStorage.setItem("access_token", access);

      // Retry the original query with new token
      result = await baseQuery(args, api, extraOptions);
    } else {
      // Logout user on failed refresh
      api.dispatch({ type: "auth/logout" });
    }
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
  tagTypes: [
    "User",
    "MarketConditions",
    "ProductHistory",
    "Products",
    "OptimizationLogs",
  ],
});
