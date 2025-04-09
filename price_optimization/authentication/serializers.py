# authentication/serializers.py
from rest_framework import serializers
from django.contrib.auth.models import User, Group, Permission
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import Role, UserProfile

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        
        # Add custom claims
        try:
            user_type = user.profile.user_type
        except UserProfile.DoesNotExist:
            user_type = 'unknown'
            
        token['username'] = user.username
        token['email'] = user.email
        token['user_type'] = user_type
        
        return token

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ('user_type', 'company', 'phone')

class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(required=False)
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    confirm_password = serializers.CharField(write_only=True, required=True)
    
    class Meta:
        model = User
        fields = ('id', 'username', 'password', 'confirm_password', 'email', 'first_name', 'last_name', 'profile')
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True},
            'email': {'required': True}
        }
    
    def validate(self, attrs):
        if attrs['password'] != attrs.pop('confirm_password'):
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs
    
    def create(self, validated_data):
        profile_data = validated_data.pop('profile', {})
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name']
        )
        user.set_password(validated_data['password'])
        user.save()
        
        # Create user profile
        UserProfile.objects.create(user=user, **profile_data)
        
        # Assign to default group based on user_type
        if 'user_type' in profile_data:
            user_type = profile_data['user_type']
            try:
                group = Group.objects.get(name=user_type)
                user.groups.add(group)
            except Group.DoesNotExist:
                pass
        
        return user

class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = ('id', 'name', 'codename')

class GroupSerializer(serializers.ModelSerializer):
    permissions = PermissionSerializer(many=True, read_only=True)
    
    class Meta:
        model = Group
        fields = ('id', 'name', 'permissions')

class RoleSerializer(serializers.ModelSerializer):
    group = GroupSerializer()
    
    class Meta:
        model = Role
        fields = ('id', 'group', 'description')

class UserRoleSerializer(serializers.ModelSerializer):
    groups = GroupSerializer(many=True, read_only=True)
    
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'groups')