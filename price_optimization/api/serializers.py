# /api/serializers.py

from rest_framework import serializers
from .models import Product, ProductHistory, MarketCondition, PriceOptimizationLog
from django.contrib.auth.models import User

class UserMinimalSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name')

class ProductHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductHistory
        fields = '__all__'
class ProductSerializer(serializers.ModelSerializer):
    created_by = UserMinimalSerializer(read_only=True)
    demand_forecast = serializers.IntegerField(read_only=True, required=False)
    optimized_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True, required=False)
    
    class Meta:
        model = Product
        fields = '__all__'
    
    def create(self, validated_data):
        # Remove created_by from validated_data if it's somehow included
        validated_data.pop('created_by', None)
        
        # Get the user from context and set it explicitly
        user = self.context['request'].user
        
        # Create the product with remaining validated data
        product = Product.objects.create(
            created_by=user,
            **validated_data
        )
        return product


# class ProductDetailSerializer(ProductSerializer):
#     history = ProductHistorySerializer(many=True, read_only=True)
    
#     class Meta(ProductSerializer.Meta):
#         fields = ProductSerializer.Meta.fields + ('history',)


# class ProductDetailSerializer(ProductSerializer):
#     history = ProductHistorySerializer(many=True, read_only=True)
    
#     class Meta:
#         model = Product
#         fields = [
#             'product_id', 'name', 'description', 'cost_price', 'selling_price', 
#             'category', 'stock_available', 'units_sold', 'customer_rating',
#             'created_by', 'created_at', 'updated_at', 'demand_forecast',
#             'optimized_price', 'history'
#         ]

class ProductDetailSerializer(ProductSerializer):
    history = ProductHistorySerializer(many=True, read_only=True)
    
    class Meta(ProductSerializer.Meta):
        # Instead of trying to concatenate, just use '__all__' and it will include all fields from the model
        # Then explicitly tell DRF to include our 'history' field as well
        fields = '__all__'
        # Add the extra relationship field
        depth = 1  # This will serialize related objects one level deep

class MarketConditionSerializer(serializers.ModelSerializer):
    created_by = UserMinimalSerializer(read_only=True)
    
    class Meta:
        model = MarketCondition
        fields = '__all__'
        read_only_fields = ('created_by',)

class PriceOptimizationLogSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    run_by = UserMinimalSerializer(read_only=True)
    
    class Meta:
        model = PriceOptimizationLog
        fields = '__all__'