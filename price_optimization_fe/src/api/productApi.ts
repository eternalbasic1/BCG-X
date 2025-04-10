// src/api/productApi.ts
import { apiSlice } from "./apiSlice";
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

export const productApi = apiSlice.injectEndpoints({
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

    // Updated to properly handle parameters
    optimizePrice: builder.query<
      PriceOptimizationResponse,
      { productId: number; params?: PriceOptimizationParams }
    >({
      query: ({ productId, params = {} }) => {
        // Create query params object
        const queryParams: Record<string, string | number | boolean> = {};

        // Only add parameters that are explicitly set
        if (params.margin_target !== undefined) {
          queryParams.margin_target = params.margin_target;
        }

        if (params.price_sensitivity !== undefined) {
          queryParams.price_sensitivity = params.price_sensitivity;
        }

        if (params.consider_market !== undefined) {
          // Convert boolean to string "true"/"false" to match backend expectation
          queryParams.consider_market = params.consider_market;
        }

        return {
          url: `/api/products/${productId}/optimize/`,
          method: "GET",
          params: queryParams,
        };
      },
    }),

    // Updated to properly handle parameters
    bulkOptimizePrices: builder.query<
      Product[],
      PriceOptimizationParams | void
    >({
      query: (params = {}) => {
        // Create query params object
        const queryParams: Record<string, string | number> = {};

        // Only add parameters that are explicitly set
        if (
          params &&
          "margin_target" in params &&
          params.margin_target !== undefined
        ) {
          queryParams.margin_target = params.margin_target;
        }

        if (
          params &&
          "price_sensitivity" in params &&
          params.price_sensitivity !== undefined
        ) {
          queryParams.price_sensitivity = params.price_sensitivity;
        }

        if (
          params &&
          "consider_market" in params &&
          params.consider_market !== undefined
        ) {
          // Convert boolean to string "true"/"false" to match backend expectation
          queryParams.consider_market = params.consider_market.toString();
        }

        return {
          url: "/api/products/bulk-optimize/",
          method: "GET",
          params: queryParams,
        };
      },
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
} = productApi;
