// src/types/index.ts

export interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email?: string;
}

export interface UserProfile extends User {
  user_type: "admin" | "buyer" | "supplier" | "analyst";
  company?: string;
  phone?: string;
}

export interface Product {
  product_id: number;
  name: string;
  description: string;
  cost_price: number;
  selling_price: number;
  category: string;
  stock_available: number;
  units_sold: number;
  customer_rating?: number;
  created_by?: User;
  created_at: string;
  updated_at: string;
  demand_forecast?: number;
  optimized_price?: number;
}

export interface ProductHistory {
  history_id: number;
  product: number; // product_id
  month: string; // ISO date
  units_sold: number;
  selling_price: number;
  cost_price: number;
  created_at: string;
}

export interface ProductDetail extends Product {
  history: ProductHistory[];
}

export interface MarketCondition {
  condition_id: number;
  name: string;
  category: string;
  trend: "up" | "down" | "stable";
  impact_factor: number;
  description?: string;
  start_date: string;
  end_date?: string;
  created_by?: User;
  created_at: string;
  updated_at: string;
}

export interface PriceOptimizationLog {
  log_id: number;
  product: Product;
  original_price: number;
  optimized_price: number;
  demand_forecast: number;
  optimization_parameters: {
    margin_target: number;
    price_sensitivity: number;
    consider_market: boolean;
  };
  run_by: User;
  created_at: string;
}

export interface DemandVisualizationData {
  product_id: number;
  product_name: string;
  historical_data: {
    date: string;
    selling_price: number;
    units_sold: number;
  }[];
  demand_curve: {
    price: number;
    demand: number;
  }[];
  current_price: number;
  forecasted_demand: number;
}

export interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  error: string | null;
  loading: boolean;
}

export interface AuthCredentials {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  confirm_password: string;
  email: string;
  first_name: string;
  last_name: string;
  profile: {
    user_type: "admin" | "buyer" | "supplier" | "analyst";
    company?: string;
    phone?: string;
  };
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: UserProfile;
}

/**
 * Parameters for price optimization requests
 */
export interface PriceOptimizationParams {
  /**
   * Target profit margin (0-1). Default: 0.3
   */
  margin_target?: number;

  /**
   * Price sensitivity factor. Higher values mean more elastic demand. Default: 1.0
   */
  price_sensitivity?: number;

  /**
   * Whether to consider market conditions. Default: true
   */
  consider_market?: boolean;
}

export interface PriceOptimizationResponse {
  product_id: number;
  product_name: string;
  current_price: number;
  optimized_price: number;
}

export interface DemandForecastResponse {
  product_id: number;
  demand_forecast: number;
}
