// src/api/apiSlice.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getToken } from "../utils/authUtils";

const baseUrl = "http://127.0.0.1:8000/"; // Adjust to your Django backend URL

const baseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers, api) => {
    // Cast `extra` to the expected type to avoid TS error
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

/*

Check what is difference between these two values

 else {
      // Logout user on failed refresh
      api.dispatch({ type: "auth/logout" });
    }


else {
//       // Logout user on failed refresh
//       api.dispatch(logout());
//     }


*/

// // src/api/apiSlice.ts
// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import { getToken } from "../utils/authUtils";
// import { logout } from "../features/auth/authSlice";

// const baseUrl = "http://127.0.0.1:8000/"; // Adjust to your Django backend URL

// const baseQuery = fetchBaseQuery({
//   baseUrl,
//   prepareHeaders: (headers) => {
//     const token = getToken();
//     if (token) {
//       headers.set("Authorization", `Bearer ${token}`);
//     }
//     return headers;
//   },
//   credentials: "include", // Important: This enables sending cookies with requests
// });

// // Create a customized fetch base query that handles token refresh
// const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
//   let result = await baseQuery(args, api, extraOptions);

//   // Handle token expiration
//   if (
//     result.error &&
//     (result.error.status === 401 || result.error.status === 403)
//   ) {
//     // Try to refresh token - we don't need to send the refresh token in the body
//     // as it will be sent in the HTTP-only cookie
//     const refreshResult = await baseQuery(
//       {
//         url: "/auth/refresh/",
//         method: "POST",
//       },
//       api,
//       extraOptions
//     );

//     if (refreshResult.data) {
//       // Store the new access token
//       const { access } = refreshResult.data as { access: string };
//       localStorage.setItem("access_token", access);

//       // Retry the original query with new token
//       result = await baseQuery(args, api, extraOptions);
//     } else {
//       // Logout user on failed refresh
//       api.dispatch(logout());
//     }
//   }

//   return result;
// };

// export const apiSlice = createApi({
//   reducerPath: "api",
//   baseQuery: baseQueryWithReauth,
//   endpoints: () => ({}),
//   tagTypes: ["User", "Trip", "SubTrip", "StateCoordinates"],
// });
