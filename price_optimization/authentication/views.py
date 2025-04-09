# authentication/views.py
from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.models import User, Group, Permission
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import Role, UserProfile
from .serializers import (
    CustomTokenObtainPairSerializer,
    UserSerializer,
    RoleSerializer,
    GroupSerializer,
    PermissionSerializer,
    UserRoleSerializer
)

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = UserSerializer

class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['username', 'email']
    search_fields = ['username', 'email', 'first_name', 'last_name']
    
    def get_queryset(self):
        # Only admins can see all users
        user = self.request.user
        try:
            if user.profile.user_type == 'admin':
                return User.objects.all()
            return User.objects.filter(id=user.id)
        except UserProfile.DoesNotExist:
            return User.objects.filter(id=user.id)

class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        # Users can only access their own data unless they're admins
        user = self.request.user
        try:
            if user.profile.user_type == 'admin':
                return User.objects.all()
            return User.objects.filter(id=user.id)
        except UserProfile.DoesNotExist:
            return User.objects.filter(id=user.id)

class RoleListView(generics.ListCreateAPIView):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        # Only admins can see roles
        user = self.request.user
        try:
            if user.profile.user_type == 'admin':
                return Role.objects.all()
            return Role.objects.none()
        except UserProfile.DoesNotExist:
            return Role.objects.none()

class RoleDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        # Only admins can manage roles
        user = self.request.user
        try:
            if user.profile.user_type == 'admin':
                return Role.objects.all()
            return Role.objects.none()
        except UserProfile.DoesNotExist:
            return Role.objects.none()

class GroupListView(generics.ListCreateAPIView):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        # Only admins can see groups
        user = self.request.user
        try:
            if user.profile.user_type == 'admin':
                return Group.objects.all()
            return Group.objects.none()
        except UserProfile.DoesNotExist:
            return Group.objects.none()

class GroupDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        # Only admins can manage groups
        user = self.request.user
        try:
            if user.profile.user_type == 'admin':
                return Group.objects.all()
            return Group.objects.none()
        except UserProfile.DoesNotExist:
            return Group.objects.none()

class PermissionListView(generics.ListAPIView):
    queryset = Permission.objects.all()
    serializer_class = PermissionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        # Only admins can see permissions
        user = self.request.user
        try:
            if user.profile.user_type == 'admin':
                return Permission.objects.all()
            return Permission.objects.none()  
        except UserProfile.DoesNotExist:
            return Permission.objects.none()

class AssignRoleView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, pk):
        # Only admins can assign roles
        if not request.user.profile.user_type == 'admin':
            return Response({"detail": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)
        
        try:
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response({"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        
        group_ids = request.data.get('group_ids', [])
        
        if not isinstance(group_ids, list):
            return Response({"detail": "group_ids must be a list"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Clear existing groups and add new ones
        user.groups.clear()
        for group_id in group_ids:
            try:
                group = Group.objects.get(pk=group_id)
                user.groups.add(group)
            except Group.DoesNotExist:
                pass
        
        return Response(UserRoleSerializer(user).data)