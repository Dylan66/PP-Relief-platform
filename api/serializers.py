# api/serializers.py

from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework.serializers import ModelSerializer
# Import standard LoginSerializer from dj-rest-auth if you want to inherit or inspect
# from dj_rest_auth.serializers import LoginSerializer
# Import password validation for registration
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

# --- UserProfile Serializer (Optional, but useful if you ever return Profile directly) ---
class UserProfileSerializer(ModelSerializer):
    # You might not use this directly in the API for individual users,
    # but it's clean to serialize the profile part
    class Meta:
        model = UserProfile
        fields = ['id', 'role'] # Include the role field


# --- Standard Serializers (Keep existing or use these) ---

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
    # Display admin user's username via the profile link
    admin_username = serializers.CharField(source='admin_profile.user.username', read_only=True, allow_null=True)
    # Optionally include the admin profile ID if needed
    admin_profile_id = serializers.PrimaryKeyRelatedField(source='admin_profile', read_only=True, allow_null=True) # Correctly get the ID

    class Meta:
        model = Organization
        fields = [
            'id', 'admin_profile', 'admin_profile_id', 'admin_username', # Add admin_profile FK/ID and username
            'name', 'location', 'contact_person', 'contact_email',
            'contact_phone', 'is_verified', 'created_at'
        ]
        read_only_fields = ['is_verified', 'created_at', 'admin_username', 'admin_profile_id']
        extra_kwargs = {
            'admin_profile': {'write_only': True, 'required': False, 'allow_null': True} # admin_profile might be set later
        }


class ProductRequestSerializer(serializers.ModelSerializer):
    # Include readable names/identifiers for foreign keys
    product_type_name = serializers.CharField(source='product_type.name', read_only=True)
    requesting_organization_name = serializers.CharField(source='requesting_organization.name', read_only=True, allow_null=True)
    assigned_distribution_center_name = serializers.CharField(source='assigned_distribution_center.name', read_only=True, allow_null=True)
    # Add requester user details (username)
    requester_username = serializers.CharField(source='requester_user.username', read_only=True, allow_null=True)

    class Meta:
        model = ProductRequest
        fields = [
            'id',
            # Requester fields (backend view perform_create sets ONE of these)
            'requesting_organization', # ID for creating/linking (should be excluded from normal user POST)
            'requesting_organization_name', # Read-only name
            'requester_user', # ID for linking (should be excluded from normal user POST)
            'requester_username', # Read-only name
            'requester_phone_number', # Read-only (set via SMS logic only)

            # Request details (required for creation)
            'product_type', # ID for creating
            'product_type_name', # Read-only name
            'quantity', # Required on create

            # Fulfillment details (read-only for requester, writeable for center admin)
            'status',
            'assigned_distribution_center', # ID for viewing/updating
            'assigned_distribution_center_name',# Read-only name
            'pickup_details', # Writeable by center admin

            # Timestamps
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
        # Fields required only when creating a request via API by ANY user type (handled by the view)
        # requester_user, requesting_organization, requester_phone_number are set by the view, not in payload
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
    """Serializer for User registration using dj-rest-auth"""
    # Note: dj-rest-auth's default expects 'password' and 'password2'
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True, label="Confirm password")
    # Add other fields you want during registration (must exist on User model or UserProfile)
    first_name = serializers.CharField(required=False, allow_blank=True)
    last_name = serializers.CharField(required=False, allow_blank=True)
    # *** Optional: Allow setting role or is_donor during registration? ***
    # For MVP, probably not. New users register as 'individual' by default (via signal).
    # Role updates to 'organization_admin', 'donor', 'center_admin' would be done later,
    # potentially via a different endpoint or admin panel.
    # role = serializers.ChoiceField(choices=USER_ROLE_CHOICES, required=False, write_only=True, default='individual')


    class Meta:
        model = User # Registering the base User model
        fields = ('username', 'email', 'password', 'password2', 'first_name', 'last_name') # Add/remove fields as needed
        extra_kwargs = {
            'email': {'required': True},
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        # Add other custom registration validations here (e.g., email uniqueness if not handled by User model)
        return attrs

    # The create method handles creating the User. The post_save signal creates the UserProfile with default role.
    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)

        # If you allowed setting role/is_donor on registration, you'd update the profile here:
        # if 'role' in self.initial_data and self.initial_data['role'] != 'individual':
        #      # Validate role change is allowed on registration?
        #      user.profile.role = self.initial_data['role']
        #      user.profile.save()
        # if 'is_donor' in self.initial_data:
        #      user.profile.is_donor = self.initial_data['is_donor']
        #      user.profile.save()

        return user


# --- Custom User Details Serializer (Used by /api/auth/user/) ---
class CustomUserDetailsSerializer(ModelSerializer):
    """
    Serializer for the User object (basic details) including the explicit role and other flags.
    Used by dj-rest-auth's user_details view.
    """
    # Basic user fields from Django User model
    id = serializers.IntegerField(read_only=True)
    username = serializers.CharField(read_only=True)
    email = serializers.EmailField(read_only=True)
    first_name = serializers.CharField(read_only=True)
    last_name = serializers.CharField(read_only=True)
    is_staff = serializers.BooleanField(read_only=True) # Built-in Django staff status
    is_superuser = serializers.BooleanField(read_only=True) # Built-in Django superuser status

    # *** Include the explicit role from UserProfile ***
    # Use SerializerMethodField to handle case where profile might not exist yet
    role = serializers.SerializerMethodField()
    # *** END Include explicit role ***

    # Include IDs of linked entities for easier fetching in frontend dashboard components
    # Use Source='profile.managed_organization.id' to access via the profile link
    linked_organization_id = serializers.PrimaryKeyRelatedField(source='profile.managed_organization', read_only=True, allow_null=True)
    linked_center_id = serializers.PrimaryKeyRelatedField(source='profile.managed_distribution_center', read_only=True, allow_null=True)
    # You could also get the profile ID itself if needed:
    profile_id = serializers.PrimaryKeyRelatedField(source='profile', read_only=True, allow_null=True)


    class Meta:
        model = User # Serializing the base User model
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'is_staff', 'is_superuser', # Built-in admin flags
            'role', # *** Explicit Role ***
            'profile_id',
            'linked_organization_id', 'linked_center_id'
        ]
        read_only_fields = fields # All fields are read-only for this endpoint


    # *** Method to get the explicit role from UserProfile ***
    def get_role(self, obj):
        try:
            # Return the role string from the associated UserProfile
            return obj.profile.role
        except UserProfile.DoesNotExist:
            # If no profile exists (shouldn't happen with signal),
            # default to 'individual' or handle as error.
            # This ensures the frontend *always* gets a role string.
            # print(f"Warning: User {obj.username} has no profile.") # Debug warning
            return 'individual' # Default role if profile missing

    # You no longer need these SerializerMethodFields if 'role' string is primary
    # If you still want them for clarity in frontend:
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
    #      try: return obj.profile.role == 'donor' # Check role string
    #      except UserProfile.DoesNotExist: return False