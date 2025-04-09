// src/services/api.ts

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../app/store";
import {
  Product,
  ProductDetail,
  ProductHistory,
  MarketCondition,
  PriceOptimizationLog,
  PriceOptimizationParams,
  PriceOptimizationResponse,
  DemandForecastResponse,
  DemandVisualizationData,
} from "../types";

// Define a base query with authentication headers
export const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:8000",
  prepareHeaders: (headers, { getState }) => {
    // Get the token from the auth state
    const token = (getState() as RootState).auth.token;

    // If we have a token, include it in the Authorization header
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

// Create the API service
export const api = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: [
    "Products",
    "ProductHistory",
    "MarketConditions",
    "OptimizationLogs",
  ],
  endpoints: (builder) => ({
    // Products
    getProducts: builder.query<Product[], void>({
      query: () => "/api/products/",
      providesTags: ["Products"],
    }),
    getProductById: builder.query<ProductDetail, number>({
      query: (id) => `/api/products/${id}/`,
      providesTags: ["Products"],
    }),
    createProduct: builder.mutation<Product, Partial<Product>>({
      query: (product) => ({
        url: "/api/products/",
        method: "POST",
        body: product,
      }),
      invalidatesTags: ["Products"],
    }),
    updateProduct: builder.mutation<
      Product,
      { id: number; product: Partial<Product> }
    >({
      query: ({ id, product }) => ({
        url: `/api/products/${id}/`,
        method: "PUT",
        body: product,
      }),
      invalidatesTags: ["Products"],
    }),
    deleteProduct: builder.mutation<void, number>({
      query: (id) => ({
        url: `/api/products/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products"],
    }),

    // Product History
    getProductHistory: builder.query<ProductHistory[], void>({
      query: () => "/api/product-history/",
      providesTags: ["ProductHistory"],
    }),
    createProductHistory: builder.mutation<
      ProductHistory,
      Partial<ProductHistory>
    >({
      query: (history) => ({
        url: "/api/product-history/",
        method: "POST",
        body: history,
      }),
      invalidatesTags: ["ProductHistory", "Products"],
    }),

    // Market Conditions
    getMarketConditions: builder.query<MarketCondition[], void>({
      query: () => "/api/market-conditions/",
      providesTags: ["MarketConditions"],
    }),
    createMarketCondition: builder.mutation<
      MarketCondition,
      Partial<MarketCondition>
    >({
      query: (condition) => ({
        url: "/api/market-conditions/",
        method: "POST",
        body: condition,
      }),
      invalidatesTags: ["MarketConditions"],
    }),

    // Optimization
    getDemandForecast: builder.query<DemandForecastResponse, number>({
      query: (productId) => `/api/products/${productId}/forecast/`,
    }),
    optimizePrice: builder.query<
      PriceOptimizationResponse,
      { productId: number; params: PriceOptimizationParams }
    >({
      query: ({ productId, params }) => ({
        url: `/api/products/${productId}/optimize/`,
        method: "GET",
        params,
      }),
    }),
    bulkOptimizePrices: builder.query<Product[], PriceOptimizationParams>({
      query: (params) => ({
        url: "/api/products/bulk-optimize/",
        method: "GET",
        params,
      }),
    }),
    getOptimizationLogs: builder.query<PriceOptimizationLog[], void>({
      query: () => "/api/optimization-logs/",
      providesTags: ["OptimizationLogs"],
    }),

    // Visualization
    getVisualizationData: builder.query<DemandVisualizationData, number>({
      query: (productId) => `/api/products/${productId}/visualization-data/`,
    }),
  }),
});

// Export the auto-generated hooks
export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductHistoryQuery,
  useCreateProductHistoryMutation,
  useGetMarketConditionsQuery,
  useCreateMarketConditionMutation,
  useGetDemandForecastQuery,
  useOptimizePriceQuery,
  useBulkOptimizePricesQuery,
  useGetOptimizationLogsQuery,
  useGetVisualizationDataQuery,
} = api;
