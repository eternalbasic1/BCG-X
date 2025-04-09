#api/services.py

import numpy as np
from datetime import datetime, date
from .models import Product, ProductHistory, MarketCondition

class DemandForecastService:
    @staticmethod
    def forecast_demand(product_id):
        """
        Enhanced demand forecasting using historical data and time-weighted averaging
        """
        try:
            product = Product.objects.get(pk=product_id)
            history = ProductHistory.objects.filter(product=product).order_by('month')
            
            if history.count() > 0:
                # Time-weighted average (more recent months have higher weight)
                total_weight = 0
                weighted_sum = 0
                
                for i, entry in enumerate(history):
                    # Weight increases with recency (i = 0 is oldest)
                    weight = i + 1  
                    weighted_sum += entry.units_sold * weight
                    total_weight += weight
                
                # Calculate weighted average
                avg_units = weighted_sum / total_weight if total_weight > 0 else product.units_sold
                
                # Check for seasonality
                current_month = date.today().month
                season_factor = 1.0
                
                # Simple seasonal adjustment
                seasonal_entries = history.filter(month__month=current_month)
                if seasonal_entries.exists():
                    seasonal_avg = sum(e.units_sold for e in seasonal_entries) / seasonal_entries.count()
                    year_avg = sum(e.units_sold for e in history) / history.count()
                    
                    if year_avg > 0:
                        season_factor = seasonal_avg / year_avg
                
                # Apply projected growth and seasonality
                growth_factor = 1.1  # 10% projected growth
                demand_forecast = int(avg_units * growth_factor * season_factor)
                
                return max(1, demand_forecast)  # Ensure positive forecast
            else:
                # If no history, return current units sold with 10% growth projection
                return max(1, int(product.units_sold * 1.1))
        except Product.DoesNotExist:
            return 0

class PriceOptimizationService:
    @staticmethod
    def optimize_price(product_id, margin_target=0.3, price_sensitivity=1.0, consider_market=True):
        """
        Enhanced price optimization using demand elasticity model and market conditions
        
        Parameters:
        - product_id: ID of the product to optimize
        - margin_target: Target profit margin (default 0.3 or 30%)
        - price_sensitivity: Price elasticity factor (default 1.0)
        - consider_market: Whether to consider market conditions (default True)
        """
        try:
            product = Product.objects.get(pk=product_id)
            demand_forecast = DemandForecastService.forecast_demand(product_id)
            
            cost_price = float(product.cost_price)
            current_price = float(product.selling_price)
            
            # Base optimal price (cost + target margin)
            base_optimal_price = cost_price * (1 + margin_target)
            
            # Adjust using price elasticity of demand
            # If price_sensitivity is high, the optimal price moves closer to current price
            # If price_sensitivity is low, we can be more aggressive with pricing
            elasticity_weight = min(max(price_sensitivity, 0.1), 2.0)
            
            # Blend current price and base optimal price based on elasticity
            blended_price = (current_price * elasticity_weight + base_optimal_price) / (1 + elasticity_weight)
            
            # Consider market conditions if requested
            if consider_market:
                # Get active market conditions for this product's category
                today = date.today()
                market_conditions = MarketCondition.objects.filter(
                    category=product.category,
                    start_date__lte=today
                ).filter(
                    end_date__gte=today
                )
                
                # Apply market condition impacts
                market_factor = 1.0
                for condition in market_conditions:
                    # Apply impact factor based on trend
                    if condition.trend == 'up':
                        market_factor *= float(condition.impact_factor)
                    elif condition.trend == 'down':
                        market_factor /= float(condition.impact_factor)
                    # 'stable' trend doesn't change the factor
                
                # Apply market factor to the price
                blended_price *= market_factor
            
            # Ensure price is not below cost plus minimum margin
            min_margin = 0.05  # 5% minimum margin
            minimum_price = cost_price * (1 + min_margin)
            
            # Round to 2 decimal places
            optimized_price = round(max(blended_price, minimum_price), 2)
            
            return optimized_price
        except Product.DoesNotExist:
            return 0.0