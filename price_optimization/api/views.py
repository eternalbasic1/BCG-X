# api/views.py 

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import generics
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
from django.http import Http404, JsonResponse
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from .pagination import CustomPagination

from .models import Product, ProductHistory, MarketCondition, PriceOptimizationLog
from .serializers import (
    ProductSerializer, 
    ProductHistorySerializer, 
    ProductDetailSerializer,
    MarketConditionSerializer,
    PriceOptimizationLogSerializer
)
from .services import DemandForecastService, PriceOptimizationService
from .filters import ProductFilter, ProductHistoryFilter, MarketConditionFilter
from .permissions import (
    IsAdmin, 
    IsBuyer, 
    IsSupplier, 
    IsAnalyst, 
    CanViewProductPricing, 
    CanOptimizeProductPricing
)

class ProductListAPIView(generics.ListCreateAPIView):
    """
    List all products or create a new product
    """
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = ProductFilter
    search_fields = ['name', 'description', 'category']
    ordering_fields = ['name', 'selling_price', 'units_sold', 'customer_rating']
    ordering = ['name']
    pagination_class = CustomPagination
    # pagination_class = None
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

class ProductDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a product instance
    """
    queryset = Product.objects.all()
    serializer_class = ProductDetailSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        pk = self.kwargs.get('pk')
        try:
            return Product.objects.get(pk=pk)
        except Product.DoesNotExist:
            raise Http404

class DemandForecastAPIView(APIView):
    """
    Get demand forecast for a product
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, CanViewProductPricing]
    
    def get(self, request, pk):
        try:
            product = Product.objects.get(pk=pk)
            demand_forecast = DemandForecastService.forecast_demand(pk)
            return Response({'product_id': pk, 'demand_forecast': demand_forecast})
        except Product.DoesNotExist:
            raise Http404

class PriceOptimizationAPIView(APIView):
    """
    Get optimized price for a product
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, CanOptimizeProductPricing]
    
    def get(self, request, pk):
        try:
            product = Product.objects.get(pk=pk)
            
            # Get parameters from query params with defaults
            margin_target = float(request.query_params.get('margin_target', 0.3))
            price_sensitivity = float(request.query_params.get('price_sensitivity', 1.0))
            consider_market = request.query_params.get('consider_market', 'true').lower() == 'true'
            
            # Pass parameters to the optimization service
            optimized_price = PriceOptimizationService.optimize_price(
                pk, 
                margin_target=margin_target,
                price_sensitivity=price_sensitivity,
                consider_market=consider_market
            )
            
            # Log the optimization if successful
            if optimized_price > 0:
                PriceOptimizationLog.objects.create(
                    product=product,
                    original_price=product.selling_price,
                    optimized_price=optimized_price,
                    demand_forecast=DemandForecastService.forecast_demand(pk),
                    optimization_parameters={
                        'margin_target': margin_target,
                        'price_sensitivity': price_sensitivity,
                        'consider_market': consider_market,
                    },
                    run_by=request.user
                )
            
            return Response({
                'product_id': pk, 
                'product_name': product.name,
                'current_price': float(product.selling_price),
                'optimized_price': optimized_price
            })
        except Product.DoesNotExist:
            raise Http404

class ProductBulkOptimizationAPIView(APIView):
    """
    Get optimized prices and demand forecasts for all products
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, CanOptimizeProductPricing]
    
    def get(self, request):
        # Apply filters if provided
        filter_set = ProductFilter(request.query_params, queryset=Product.objects.all())
        products = filter_set.qs
        
        # Get optimization parameters
        margin_target = float(request.query_params.get('margin_target', 0.3))
        price_sensitivity = float(request.query_params.get('price_sensitivity', 1.0))
        consider_market = request.query_params.get('consider_market', 'true').lower() == 'true'
        
        result = []
        
        for product in products:
            demand_forecast = DemandForecastService.forecast_demand(product.product_id)
            optimized_price = PriceOptimizationService.optimize_price(
                product.product_id,
                margin_target=margin_target,
                price_sensitivity=price_sensitivity,
                consider_market=consider_market
            )
            
            product_data = ProductSerializer(product).data
            product_data['demand_forecast'] = demand_forecast
            product_data['optimized_price'] = optimized_price
            
            result.append(product_data)
        
        return Response(result)

class ProductHistoryAPIView(generics.ListCreateAPIView):
    """
    List all product history entries or create a new one
    """
    queryset = ProductHistory.objects.all()
    serializer_class = ProductHistorySerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_class = ProductHistoryFilter
    ordering_fields = ['month', 'units_sold', 'selling_price']
    ordering = ['-month']
    pagination_class = CustomPagination
    # pagination_class = None

class ProductHistoryDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a product history instance
    """
    queryset = ProductHistory.objects.all()
    serializer_class = ProductHistorySerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsAdmin]

class MarketConditionAPIView(generics.ListCreateAPIView):
    """
    List all market conditions or create a new one
    """
    queryset = MarketCondition.objects.all()
    serializer_class = MarketConditionSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = MarketConditionFilter
    search_fields = ['name', 'description', 'category']
    ordering_fields = ['name', 'start_date', 'impact_factor']
    ordering = ['-start_date']
    pagination_class = CustomPagination
    # pagination_class = None
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

class MarketConditionDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a market condition
    """
    queryset = MarketCondition.objects.all()
    serializer_class = MarketConditionSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsAdmin|IsAnalyst]

class PriceOptimizationLogAPIView(generics.ListAPIView):
    """
    List optimization logs
    """
    queryset = PriceOptimizationLog.objects.all()
    serializer_class = PriceOptimizationLogSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsAdmin|IsAnalyst]
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['product', 'run_by', 'created_at']
    ordering_fields = ['created_at', 'product', 'original_price', 'optimized_price']
    ordering = ['-created_at']

class DemandVisualizationDataAPIView(APIView):
    """
    Get demand visualization data for charts
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, CanViewProductPricing]
    
    def get(self, request, pk):
        try:
            product = Product.objects.get(pk=pk)
            history = ProductHistory.objects.filter(product=product).order_by('month')
            
            # Create data points for the demand vs price chart
            price_points = []
            for h in history:
                price_points.append({
                    'date': h.month.strftime('%Y-%m'),
                    'selling_price': float(h.selling_price),
                    'units_sold': h.units_sold
                })
            
            # Generate hypothetical price points for demand curve
            base_price = float(product.selling_price)
            base_demand = DemandForecastService.forecast_demand(pk)
            price_sensitivity = 0.7  # Elasticity factor
            
            curve_points = []
            price_range = [base_price * (1 - 0.3 + i * 0.05) for i in range(13)]  # -30% to +30%
            
            for price in price_range:
                # Simple elasticity model: (P1/P0)^(-e) = (Q1/Q0)
                # where e is price elasticity of demand
                price_ratio = price / base_price
                demand_ratio = price_ratio ** (-price_sensitivity)
                demand = base_demand * demand_ratio
                
                curve_points.append({
                    'price': round(price, 2),
                    'demand': round(demand, 0)
                })
            
            return Response({
                'product_id': pk,
                'product_name': product.name,
                'historical_data': price_points,
                'demand_curve': curve_points,
                'current_price': float(product.selling_price),
                'forecasted_demand': base_demand
            })
        except Product.DoesNotExist:
            raise Http404
        


def health_check(request):
    # You can include additional health checks here
    return JsonResponse({"status": "ok", "message": "Service is operational"}, status=200)