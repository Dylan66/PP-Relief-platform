# api/serializers.py

from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework.serializers import ModelSerializer
# Keep import validate_password - we'll test with it enabled temporarily
from django.contrib.auth.password_validation import validate_password

from .models import (
    UserProfile, # Import UserProfile
    Organization,
    DistributionCenter,
    ProductType,
    InventoryItem,
    ProductRequest,
    USER_ROLE_CHOICES # Import role choices
)

User = get_user_model()

# *** DEBUG PRINT: Confirm Serializer file is loaded and class is defined ***
print(">>> api/serializers.py is being executed <<<")
print(">>> RegisterSerializer class is being defined/imported <<<")
# *** END DEBUG PRINT ***


# --- UserProfile Serializer (Keep existing) ---
class UserProfileSerializer(ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['id', 'role']


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
    product_type_name = serializers.CharField(source='product_type.name', read_only=True)
    requesting_organization_name = serializers.CharField(source='requesting_organization.name', read_only=True, allow_null=True)
    assigned_distribution_center_name = serializers.CharField(source='assigned_distribution_center.name', read_only=True, allow_null=True)
    requester_username = serializers.CharField(source='requester_user.username', read_only=True, allow_null=True)

    class Meta:
        model = ProductRequest
        fields = [
            'id',
            'requesting_organization',
            'requesting_organization_name',
            'requester_user',
            'requester_username',
            'requester_phone_number',

            'product_type',
            'product_type_name',
            'quantity',

            'status',
            'assigned_distribution_center',
            'assigned_distribution_center_name',
            'pickup_details',

            'created_at',
            'updated_at'
        ]
        read_only_fields = [
            'requesting_organization_name',
            'requester_username',
            'assigned_distribution_center_name',
            'product_type_name',
            'requester_phone_number',
            'created_at',
            'updated_at',
        ]
        extra_kwargs = {
             'product_type': {'write_only': True, 'required': True},
             'quantity': {'required': True},

            'requesting_organization': {'write_only': True, 'required': False, 'allow_null': True},
            'requester_user': {'write_only': True, 'required': False, 'allow_null': True},
            'requester_phone_number': {'write_only': True, 'required': False, 'allow_null': True, 'allow_blank': True},

            'status': {'read_only': True},
            'assigned_distribution_center': {'read_only': True},
            'pickup_details': {'read_only': True},

        }


# --- User Serializers for dj-rest-auth ---

class RegisterSerializer(ModelSerializer):
    """
    Serializer for User registration using dj-rest-auth.
    Includes debug prints and validate_password.
    """
    # Note: dj-rest-auth's default expects 'password' and 'password2'
    # We are testing with validate_password re-enabled but password2 validation removed.
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password]) # <-- validate_password RE-ENABLED
    password2 = serializers.CharField(write_only=True, required=True, label="Confirm password") # <-- Keep field, but remove validation

    first_name = serializers.CharField(required=False, allow_blank=True)
    last_name = serializers.CharField(required=False, allow_blank=True)


    class Meta:
        model = User # Registering the base User model
        fields = ('username', 'email', 'password', 'password2', 'first_name', 'last_name') # Keep password2 in fields for now
        extra_kwargs = {
            'email': {'required': True},
        }

    # *** DEBUG PRINT: Override is_valid to inspect data and errors early ***
    def is_valid(self, raise_exception=False):
        # Print the data received by the serializer *before* standard validation
        print("\n>>> RegisterSerializer.is_valid called <<<")
        print("RegisterSerializer initial_data:", self.initial_data)

        # Call the original is_valid method to perform validation
        is_valid_bool = super().is_valid(raise_exception=False) # Don't raise exception yet

        # Print the validation errors found by super().is_valid
        print("RegisterSerializer is_valid result:", is_valid_bool)
        print("RegisterSerializer validation errors:", self.errors)
        print(">>> RegisterSerializer.is_valid finished <<<")

        # Manually raise the exception if needed, based on the original call's flag
        if raise_exception and not is_valid_bool:
            raise serializers.ValidationError(self.errors)

        return is_valid_bool
    # *** END DEBUG PRINT ***


    # *** Modified validate method: Keep password match check commented out ***
    # The error might be hitting before this method, but keep it here for structure.
    # The raw validate_password validator is now on the field itself.
    def validate(self, attrs):
        print(">>> RegisterSerializer.validate called <<<")
        # Temporarily comment out password match check
        # if attrs['password'] != attrs['password2']:
        #     print("Passwords do not match in validate.")
        #     raise serializers.ValidationError({"password": "Password fields didn't match."})
        print(">>> RegisterSerializer.validate finished <<<")
        return attrs

    def create(self, validated_data):
        """
        Overrides default create to correctly create a User with a hashed password.
        """
        print("\n>>> RegisterSerializer.create called <<<")
        # *** DEBUG LOG: See what validated_data contains just before user creation ***
        print("RegisterSerializer validated_data:", validated_data)

        # Pop password2 *only if* it's expected by User.objects.create_user (it's not)
        # Since we removed the validation check in validate, we should pop it here
        # if the frontend is sending it. The frontend is sending it.
        validated_data_for_user = validated_data.copy() # Create a copy to modify
        if 'password2' in validated_data_for_user:
             validated_data_for_user.pop('password2')
             print("Popped password2 from validated_data copy for User creation.")

        # Create the User instance using validated data (without password2)
        # Use create_user which handles password hashing
        user = User.objects.create_user(**validated_data_for_user)

        # The post_save signal (create_user_profile) will automatically create the UserProfile here.

        # *** DEBUG LOG: Confirm user creation ***
        print("User created by serializer:", user)
        print(">>> RegisterSerializer.create finished <<<")

        return user


# --- Custom User Details Serializer (Used by /api/auth/user/) (Keep existing) ---
class CustomUserDetailsSerializer(ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    username = serializers.CharField(read_only=True)
    email = serializers.EmailField(read_only=True)
    first_name = serializers.CharField(read_only=True)
    last_name = serializers.CharField(read_only=True)
    is_staff = serializers.BooleanField(read_only=True)
    is_superuser = serializers.BooleanField(read_only=True)

    role = serializers.SerializerMethodField()

    linked_organization_id = serializers.PrimaryKeyRelatedField(source='profile.managed_organization', read_only=True, allow_null=True)
    linked_center_id = serializers.PrimaryKeyRelatedField(source='profile.managed_distribution_center', read_only=True, allow_null=True)
    profile_id = serializers.PrimaryKeyRelatedField(source='profile', read_only=True, allow_null=True)


    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'is_staff', 'is_superuser',
            'role',
            'profile_id',
            'linked_organization_id', 'linked_center_id'
        ]
        read_only_fields = fields


    def get_role(self, obj):
        try:
            return obj.profile.role
        except UserProfile.DoesNotExist:
            return 'individual'

    # Keep these SerializerMethodFields if you want these flags in addition to the 'role' string
    # def get_is_individual_recipient(self, obj):
    #    try: return obj.profile.role == 'individual'
    #    except UserProfile.DoesNotExist: return True
    #
    # def get_is_org_admin(self, obj):
    #    try: return obj.profile.role == 'organization_admin'
    #    except UserProfile.DoesNotExist: return False
    #
    # def get_is_center_admin(self, obj):
    #    try: return obj.profile.role == 'center_admin'
    #    except UserProfile.DoesNotExist: return False
    #
    # def get_is_donor(self, obj):
    #      try: return obj.profile.role == 'donor' # Or check obj.profile.role == 'donor'
    #      except UserProfile.DoesNotExist: return False