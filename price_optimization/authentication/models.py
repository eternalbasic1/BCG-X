# authentication/models.py
from django.db import models
from django.contrib.auth.models import User, Group, Permission

class Role(models.Model):
    """
    Custom role model to extend Django's Group model
    """
    group = models.OneToOneField(Group, on_delete=models.CASCADE)
    description = models.TextField(blank=True)
    
    def __str__(self):
        return self.group.name

class UserProfile(models.Model):
    """
    Extended user profile model
    """
    USER_TYPES = (
        ('admin', 'Administrator'),
        ('buyer', 'Buyer'),
        ('supplier', 'Supplier'),
        ('analyst', 'Analyst'),
    )
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    user_type = models.CharField(max_length=20, choices=USER_TYPES, default='buyer')
    company = models.CharField(max_length=100, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.user.username} - {self.get_user_type_display()}"