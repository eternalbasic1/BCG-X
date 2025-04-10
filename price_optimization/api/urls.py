# api/urls.py 

from django.urls import path
from .views import (
    ProductListAPIView,
    ProductDetailAPIView,
    DemandForecastAPIView,
    PriceOptimizationAPIView,
    ProductBulkOptimizationAPIView,
    ProductHistoryAPIView,
    ProductHistoryDetailAPIView,
    MarketConditionAPIView,
    MarketConditionDetailAPIView,
    PriceOptimizationLogAPIView,
    DemandVisualizationDataAPIView,
    health_check
)

urlpatterns = [
    # Product endpoints
    path('products/', ProductListAPIView.as_view(), name='product-list'),
    path('products/<int:pk>/', ProductDetailAPIView.as_view(), name='product-detail'),
    
    # Product history endpoints
    path('product-history/', ProductHistoryAPIView.as_view(), name='product-history-list'),
    path('product-history/<int:pk>/', ProductHistoryDetailAPIView.as_view(), name='product-history-detail'),
    
    # Market condition endpoints
    path('market-conditions/', MarketConditionAPIView.as_view(), name='market-condition-list'),
    path('market-conditions/<int:pk>/', MarketConditionDetailAPIView.as_view(), name='market-condition-detail'),
    
    # Optimization endpoints
    path('products/<int:pk>/forecast/', DemandForecastAPIView.as_view(), name='demand-forecast'),
    path('products/<int:pk>/optimize/', PriceOptimizationAPIView.as_view(), name='price-optimization'),
    path('products/bulk-optimize/', ProductBulkOptimizationAPIView.as_view(), name='bulk-optimization'),
    path('optimization-logs/', PriceOptimizationLogAPIView.as_view(), name='optimization-logs'),
    
    # Visualization data endpoints
    path('products/<int:pk>/visualization-data/', DemandVisualizationDataAPIView.as_view(), name='visualization-data'),
    path('health/', health_check, name='health_check'),
]