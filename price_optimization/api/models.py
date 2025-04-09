# api/models.py
from django.db import models
from django.contrib.auth.models import User

class Product(models.Model):
    product_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255, db_index=True)  # Added index for better search performance
    description = models.TextField()
    cost_price = models.DecimalField(max_digits=10, decimal_places=2)
    selling_price = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(max_length=100, db_index=True)  # Added index for filtering
    stock_available = models.IntegerField()
    units_sold = models.IntegerField()
    customer_rating = models.DecimalField(max_digits=3, decimal_places=1, null=True, blank=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_products')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name
    
    class Meta:
        indexes = [
            models.Index(fields=['name']),
            models.Index(fields=['category']),
        ]
        permissions = [
            ("view_product_pricing", "Can view product pricing information"),
            ("optimize_product_pricing", "Can optimize product pricing"),
        ]

class ProductHistory(models.Model):
    history_id = models.AutoField(primary_key=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='history')
    month = models.DateField()  # Store the first day of the month for simplicity
    units_sold = models.IntegerField()
    selling_price = models.DecimalField(max_digits=10, decimal_places=2)
    cost_price = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('product', 'month')
        ordering = ['product', 'month']
    
    def __str__(self):
        return f"{self.product.name} - {self.month}"

class MarketCondition(models.Model):
    """Store market conditions that affect product pricing"""
    TREND_CHOICES = (
        ('up', 'Upward'),
        ('down', 'Downward'),
        ('stable', 'Stable'),
    )
    
    condition_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=100)
    trend = models.CharField(max_length=10, choices=TREND_CHOICES)
    impact_factor = models.DecimalField(max_digits=5, decimal_places=2, help_text="Factor to multiply with base price")
    description = models.TextField(blank=True)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.name} - {self.get_trend_display()}"

class PriceOptimizationLog(models.Model):
    """Log of price optimization runs"""
    log_id = models.AutoField(primary_key=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='optimization_logs')
    original_price = models.DecimalField(max_digits=10, decimal_places=2)
    optimized_price = models.DecimalField(max_digits=10, decimal_places=2)
    demand_forecast = models.IntegerField()
    optimization_parameters = models.JSONField(default=dict)
    run_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.product.name} - {self.created_at.strftime('%Y-%m-%d %H:%M')}"