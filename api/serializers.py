# api/serializers.py

from rest_framework import serializers
from django.contrib.auth.models import User # Import User
from dj_rest_auth.registration.serializers import RegisterSerializer as DjRestAuthRegisterSerializer

from .models import (
    Organization,
    DistributionCenter,
    ProductType,
    InventoryItem,
    ProductRequest
)
# We might need User serializer later for authentication
# from django.contrib.auth.models import User

class ProductTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductType
        fields = ['id', 'name', 'description'] # Expose id, name, and description

class DistributionCenterSerializer(serializers.ModelSerializer):
    class Meta:
        model = DistributionCenter
        fields = [
            'id',
            'name',
            'location',
            'contact_email',
            'contact_phone',
            'operating_hours'
        ] # Read-only info useful for donors/orgs

class InventoryItemSerializer(serializers.ModelSerializer):
    # Display product type name instead of just its ID
    product_type_name = serializers.CharField(source='product_type.name', read_only=True)
    # Optionally include distribution center name if listing all inventory
    # distribution_center_name = serializers.CharField(source='distribution_center.name', read_only=True)

    class Meta:
        model = InventoryItem
        fields = [
            'id',
            'distribution_center', # Foreign Key ID (needed for filtering/updates)
            'product_type',        # Foreign Key ID (needed for updates)
            'product_type_name',   # Readable name
            'quantity',
            'last_updated'
        ]
        # Make distribution_center and product_type writeable for creating/updating items,
        # but product_type_name read-only.
        read_only_fields = ['last_updated', 'product_type_name']

# --- User Serializer ---
class UserSerializer(serializers.ModelSerializer):
    """Serializer for the User object (basic details)"""
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name') # Exclude password

# --- User Registration Serializer ---
class RegisterSerializer(DjRestAuthRegisterSerializer):
    """Serializer for User registration"""

    # Add other fields you want during registration
    first_name = serializers.CharField(required=False, allow_blank=True,max_length=150)
    last_name = serializers.CharField(required=False, allow_blank=True, max_length=150)

    def save(self, request):
        """
        Override save to handle first_name and last_name.
        This method MUST accept the 'request' argument passed by the view.
        """
        # Call the parent class's save method first.
        # This handles creating the user, setting password, etc., and returns the user object.
        user = super().save(request)

        # Now, add the first_name and last_name to the user object
        user.first_name = self.validated_data.get('first_name', '')
        user.last_name = self.validated_data.get('last_name', '')
        user.save(update_fields=['first_name', 'last_name']) # Save only these fields

        return user

    
    

class OrganizationSerializer(serializers.ModelSerializer):
    # Optionally display admin user's username
    admin_username = serializers.CharField(source='admin_user.username', read_only=True, allow_null=True)
    class Meta:
        model = Organization
        fields = [
            'id',
            'admin_user', 
            'admin_username',
            'name',
            'location',
            'contact_person',
            'contact_email',
            'contact_phone',
            'is_verified', # Read-only for most, modifiable by admin
            'created_at'
        ]
        read_only_fields = ['is_verified', 'created_at', 'admin_username'] # Verification is an admin task


class ProductRequestSerializer(serializers.ModelSerializer):
    # Include readable names for foreign keys
    product_type_name = serializers.CharField(source='product_type.name', read_only=True)
    requesting_organization_name = serializers.CharField(source='requesting_organization.name', read_only=True, allow_null=True)
    assigned_distribution_center_name = serializers.CharField(source='assigned_distribution_center.name', read_only=True, allow_null=True)
    
    # Add requester user details
    requester_username = serializers.CharField(source='requester_user.username', read_only=True, allow_null=True)

    class Meta:
        model = ProductRequest
        fields = [
            'id',
            'requesting_organization', # ID for creating/linking
            'requesting_organization_name', # Read-only name
            'requester_user', # FK ID (usually set automatically based on login)
            'requester_username', # Read-only name
            'requester_phone_number', # Will be used by SMS later, maybe read-only here

            'product_type', # ID for creating
            'product_type_name', # Read-only name
            'quantity',
            'status',
            'assigned_distribution_center', # ID for viewing/updating
            'assigned_distribution_center_name', # Read-only name
            'pickup_details',
            'created_at',
            'updated_at'
        ]
        read_only_fields = [
            'requesting_organization_name',
            'requester_username',
            'assigned_distribution_center_name',
            'product_type_name',
            'requester_phone_number', # Don't allow web users to set this directly
            'created_at',
            'updated_at',
            'requesting_organization', 
            'requester_user',


            # Status might be read-only for requester, but writeable for center admin
            # Assigned center might be set by system/admin, not directly by requester
        ]
         # Fields required only when creating a request via API:
        extra_kwargs = {
            'product_type': {'write_only': True, 'required': True}, # Need ID to create
            'quantity': {'required': True},
        }



    

    # We'll add logic later to automatically link 'requesting_organization'
    # based on the logged-in user making the request. For now, it's writeable.