# api/serializers.py

from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework.serializers import ModelSerializer
from django.contrib.auth.password_validation import validate_password

from .models import (
    UserProfile,
    Organization,
    DistributionCenter,
    ProductType,
    InventoryItem,
    ProductRequest,
    USER_ROLE_CHOICES
)

User = get_user_model()

# --- UserProfile Serializer (Keep existing) ---
class UserProfileSerializer(ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['id', 'role', 'location']


# --- Standard Serializers (Keep existing) ---

class ProductTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductType
        fields = ['id', 'name', 'description']

class DistributionCenterSerializer(serializers.ModelSerializer):
    class Meta:
        model = DistributionCenter
        fields = [
            'id', 'name', 'location', 'contact_email', 'contact_phone', 'operating_hours'
        ]

class InventoryItemSerializer(serializers.ModelSerializer):
    product_type_name = serializers.CharField(source='product_type.name', read_only=True)

    class Meta:
        model = InventoryItem
        fields = [
            'id', 'distribution_center', 'product_type', 'product_type_name', 'quantity', 'last_updated'
        ]
        read_only_fields = ['last_updated', 'product_type_name']

class OrganizationSerializer(serializers.ModelSerializer):
    admin_username = serializers.CharField(source='admin_profile.user.username', read_only=True, allow_null=True)
    admin_profile_id = serializers.PrimaryKeyRelatedField(source='admin_profile', read_only=True, allow_null=True)

    class Meta:
        model = Organization
        fields = [
            'id', 'admin_profile', 'admin_profile_id', 'admin_username',
            'name', 'location', 'contact_person', 'contact_email',
            'contact_phone', 'is_verified', 'created_at'
        ]
        read_only_fields = ['is_verified', 'created_at', 'admin_username', 'admin_profile_id']
        extra_kwargs = {
            'admin_profile': {'write_only': True, 'required': False, 'allow_null': True}
        }


class ProductRequestSerializer(serializers.ModelSerializer):
    # Fields that are ONLY output by the API (read-only)
    requesting_organization_name = serializers.CharField(source='requesting_organization.name', read_only=True, allow_null=True)
    requester_username = serializers.CharField(source='requester_user.username', read_only=True, allow_null=True)
    product_type_name = serializers.CharField(source='product_type.name', read_only=True)
    assigned_distribution_center_name = serializers.CharField(source='assigned_distribution_center.name', read_only=True, allow_null=True)

    class Meta:
        model = ProductRequest
        fields = [
            'id',
            # Fields that are set by the backend view (write-only on create, read-only after)
            'requesting_organization', # User ID or Org ID depending on role - set by view
            'requester_user',          # User ID - set by view
            'requester_phone_number',  # Phone number - set by SMS view

            # Fields required for creating a request (input from frontend)
            'product_type', # ProductType ID - sent from frontend
            'quantity',     # Integer quantity - sent from frontend

            # Fields related to fulfillment (read-only for requester, writeable for admin)
            'status', # String choice - set by admin view
            'assigned_distribution_center', # DistributionCenter ID - set by admin view
            'pickup_details', # Text field - set by admin view

            # Fields that are ONLY output by the API (read-only timestamps)
            'created_at',
            'updated_at',

            # Include the read-only name fields for output
            'requesting_organization_name',
            'requester_username',
            'product_type_name',
            'assigned_distribution_center_name',
        ]
        # *** Correctly define read_only_fields ***
        # This list should ONLY contain fields that are NEVER taken as input.
        read_only_fields = [
            'id',
            'requesting_organization_name',
            'requester_username',
            'product_type_name',
            'assigned_distribution_center_name',
            'created_at',
            'updated_at',
        ]
        # *** End Corrected read_only_fields ***

        extra_kwargs = {
             # *** Correctly define write_only fields ***
             # These fields are received as input from the frontend during creation.
             # The backend view then uses these validated inputs to set the model fields.
             # They are not read_only_fields but are typically excluded from output by default
             # unless explicitly listed in 'fields'.
             'product_type': {'write_only': True, 'required': True},
             'quantity': {'write_only': True, 'required': True},

             # These fields are set by the backend view's perform_create based on role,
             # so they are write-only *from the perspective of the API input payload*.
             # They are not expected in the POST body from the frontend requester.
            'requesting_organization': {'write_only': True, 'required': False, 'allow_null': True},
            'requester_user': {'write_only': True, 'required': False, 'allow_null': True},
            'requester_phone_number': {'write_only': True, 'required': False, 'allow_null': True, 'allow_blank': True},

            # These fields are read-only for requesters but writeable for admins.
            # They should NOT be in read_only_fields. Mark them as read-only BY DEFAULT
            # in extra_kwargs. View permissions/logic will override read_only=True for admins.
            'status': {'read_only': True},
            'assigned_distribution_center': {'read_only': True},
            'pickup_details': {'read_only': True},

            # You could also explicitly make the names read-only here, though they are already in read_only_fields
            # 'requesting_organization_name': {'read_only': True}, # Redundant as it's in read_only_fields
        }


# --- User Serializers for dj-rest-auth --- (Keep existing)

class RegisterSerializer(ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True, label="Confirm password")
    first_name = serializers.CharField(required=False, allow_blank=True)
    last_name = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'password2', 'first_name', 'last_name')
        extra_kwargs = {
            'email': {'required': True},
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        validated_data_for_user = validated_data.copy()
        if 'password2' in validated_data_for_user:
             validated_data_for_user.pop('password2')

        user = User.objects.create_user(**validated_data_for_user)
        return user


class CustomUserDetailsSerializer(ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    username = serializers.CharField(read_only=True)
    email = serializers.EmailField(read_only=True)
    first_name = serializers.CharField(read_only=True)
    last_name = serializers.CharField(read_only=True)
    is_staff = serializers.BooleanField(read_only=True)
    is_superuser = serializers.BooleanField(read_only=True)
    role = serializers.SerializerMethodField()
    location = serializers.CharField(source='profile.location', read_only=True, allow_null=True, allow_blank=True)
    linked_organization_id = serializers.PrimaryKeyRelatedField(source='profile.managed_organization', read_only=True, allow_null=True)
    linked_center_id = serializers.PrimaryKeyRelatedField(source='profile.managed_distribution_center', read_only=True, allow_null=True)
    profile_id = serializers.PrimaryKeyRelatedField(source='profile', read_only=True, allow_null=True)


    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'is_staff', 'is_superuser',
            'role',
            'location',
            'profile_id',
            'linked_organization_id', 'linked_center_id'
        ]
        read_only_fields = fields

    def get_role(self, obj):
        try:
            return obj.profile.role
        except UserProfile.DoesNotExist:
            return 'individual'