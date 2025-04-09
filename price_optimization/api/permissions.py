# api/permissions.py
from rest_framework import permissions

class IsAdmin(permissions.BasePermission):
    """
    Custom permission to only allow admins to access the view.
    """
    def has_permission(self, request, view):
        return request.user.profile.user_type == 'admin'

class IsBuyer(permissions.BasePermission):
    """
    Custom permission to only allow buyers to access the view.
    """
    def has_permission(self, request, view):
        return request.user.profile.user_type == 'buyer'

class IsSupplier(permissions.BasePermission):
    """
    Custom permission to only allow suppliers to access the view.
    """
    def has_permission(self, request, view):
        return request.user.profile.user_type == 'supplier'

class IsAnalyst(permissions.BasePermission):
    """
    Custom permission to only allow analysts to access the view.
    """
    def has_permission(self, request, view):
        return request.user.profile.user_type == 'analyst'

class CanViewProductPricing(permissions.BasePermission):
    """
    Custom permission to only allow users with view_product_pricing permission.
    """
    def has_permission(self, request, view):
        return request.user.has_perm('api.view_product_pricing')

class CanOptimizeProductPricing(permissions.BasePermission):
    """
    Custom permission to only allow users with optimize_product_pricing permission.
    """
    def has_permission(self, request, view):
        return request.user.has_perm('api.optimize_product_pricing')

class ReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow read-only operations.
    """
    def has_permission(self, request, view):
        return request.method in permissions.SAFE_METHODS