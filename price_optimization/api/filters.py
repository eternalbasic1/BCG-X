# api/filters.py
import django_filters
from django.db.models import Q
from .models import Product, ProductHistory, MarketCondition

class ProductFilter(django_filters.FilterSet):
    """
    FilterSet for Product model with advanced filtering capabilities
    """
    name = django_filters.CharFilter(lookup_expr='icontains')
    category = django_filters.CharFilter(lookup_expr='iexact')
    description = django_filters.CharFilter(lookup_expr='icontains')
    min_price = django_filters.NumberFilter(field_name='selling_price', lookup_expr='gte')
    max_price = django_filters.NumberFilter(field_name='selling_price', lookup_expr='lte')
    min_rating = django_filters.NumberFilter(field_name='customer_rating', lookup_expr='gte')
    min_stock = django_filters.NumberFilter(field_name='stock_available', lookup_expr='gte')
    is_in_stock = django_filters.BooleanFilter(method='filter_in_stock')
    
    def filter_in_stock(self, queryset, name, value):
        if value:
            return queryset.filter(stock_available__gt=0)
        return queryset.filter(stock_available=0)
    
    class Meta:
        model = Product
        fields = ['name', 'category', 'description', 'min_price', 'max_price', 
                  'min_rating', 'min_stock', 'is_in_stock']

class ProductHistoryFilter(django_filters.FilterSet):
    """
    FilterSet for ProductHistory model
    """
    product = django_filters.NumberFilter(field_name='product__product_id')
    product_name = django_filters.CharFilter(field_name='product__name', lookup_expr='icontains')
    category = django_filters.CharFilter(field_name='product__category', lookup_expr='iexact')
    start_date = django_filters.DateFilter(field_name='month', lookup_expr='gte')
    end_date = django_filters.DateFilter(field_name='month', lookup_expr='lte')
    
    class Meta:
        model = ProductHistory
        fields = ['product', 'product_name', 'category', 'start_date', 'end_date']

class MarketConditionFilter(django_filters.FilterSet):
    """
    FilterSet for MarketCondition model
    """
    name = django_filters.CharFilter(lookup_expr='icontains')
    category = django_filters.CharFilter(lookup_expr='iexact')
    trend = django_filters.ChoiceFilter(choices=MarketCondition.TREND_CHOICES)
    active = django_filters.BooleanFilter(method='filter_active')
    start_date = django_filters.DateFilter(field_name='start_date', lookup_expr='gte')
    end_date = django_filters.DateFilter(field_name='end_date', lookup_expr='lte')
    
    def filter_active(self, queryset, name, value):
        from datetime import date
        today = date.today()
        if value:
            return queryset.filter(
                Q(start_date__lte=today) & 
                (Q(end_date__gte=today) | Q(end_date__isnull=True))
            )
        return queryset.filter(
            Q(start_date__gt=today) | 
            Q(end_date__lt=today)
        )
    
    class Meta:
        model = MarketCondition
        fields = ['name', 'category', 'trend', 'active', 'start_date', 'end_date']