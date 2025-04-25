# api/admin.py

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin # Import base UserAdmin
from django.contrib.auth.models import User # Import default User model

from .models import (
    UserProfile, # Import UserProfile
    Organization,
    DistributionCenter,
    ProductType,
    InventoryItem,
    ProductRequest,
    USER_ROLE_CHOICES # Import roles for filtering
)

# --- Customize User Admin to include UserProfile inline ---
class UserProfileInline(admin.StackedInline): # Or admin.StackedInline for more vertical layout
    model = UserProfile
    can_delete = False # Prevent deleting the profile when deleting the user
    verbose_name_plural = 'Profile' # Display name in admin
    # Add fields from UserProfile you want to edit directly on User page
    fields = ('role',) # Allow editing the explicit role here
    # You could also set max_num=1 here, but get_formsets_with_inlines is more explicit for handling add/change


# Define a new User admin
class CustomUserAdmin(BaseUserAdmin):
    inlines = (UserProfileInline,) # Add the UserProfile inline
    # Add profile-related fields to list_display or fieldsets if desired
    list_display = BaseUserAdmin.list_display + ('get_profile_role', 'is_org_admin_display', 'is_center_admin_display') # Add custom columns
    list_filter = BaseUserAdmin.list_filter + ('profile__role',) # Allow filtering users by profile role


    # --- FIX START: Exclude ProfileInline from the add form ---
    # Override this method to control which inlines are displayed/processed
    def get_formsets_with_inlines(self, request, obj=None):
        for inline in self.get_inline_instances(request, obj):
            # 'obj' is the User instance. If obj is None, we are on the add page.
            # If obj is not None, we are on the change page.
            # We want to skip the UserProfileInline on the add page (obj is None).
            if isinstance(inline, UserProfileInline) and obj is None:
                 # Skip this inline for new user creation
                 continue
            # For the change page (obj is not None) or for other inlines, yield the formset
            yield inline.get_formset(request, obj), inline
    # --- FIX END ---


    # Custom method for list_display to show the role from the profile
    @admin.display(description='Profile Role')
    def get_profile_role(self, obj):
        try:
            return obj.profile.get_role_display() # Use get_role_display for human-readable choice
        except UserProfile.DoesNotExist:
            return "No Profile" # Indicate if profile is missing


    # Custom methods to display derived admin status (Optional, helps verify admin linking)
    @admin.display(description='Is Org Admin', boolean=True)
    def is_org_admin_display(self, obj):
        try:
             # Check if profile manages an org (via the reverse relation)
            return hasattr(obj.profile, 'managed_organization') and obj.profile.managed_organization is not None
        except UserProfile.DoesNotExist:
            return False

    @admin.display(description='Is Center Admin', boolean=True)
    def is_center_admin_display(self, obj):
        try:
            # Check if profile manages a center (via the reverse relation)
            return hasattr(obj.profile, 'managed_distribution_center') and obj.profile.managed_distribution_center is not None
        except UserProfile.DoesNotExist:
            return False


# Re-register UserAdmin
admin.site.unregister(User) # Unregister the default User admin
admin.site.register(User, CustomUserAdmin) # Register your custom User admin


# --- Register other models (Keep existing registrations) ---

# @admin.register(UserProfile) # Don't register separately if using inline on User
# class UserProfileAdmin(admin.ModelAdmin):
#     list_display = ('user', 'role') # Display role
#     list_filter = ('role',) # Filter by role
#     search_fields = ('user__username', 'user__email', 'role') # Search by role string


@admin.register(Organization)
class OrganizationAdmin(admin.ModelAdmin):
    list_display = ('name', 'location', 'admin_profile', 'is_verified', 'created_at') # Add admin_profile
    list_filter = ('is_verified', 'location')
    search_fields = ('name', 'location', 'contact_person', 'admin_profile__user__username') # Search by admin username
    raw_id_fields = ('admin_profile',) # Use raw_id_fields for ForeignKey/OneToOneField for easier selection

@admin.register(DistributionCenter)
class DistributionCenterAdmin(admin.ModelAdmin):
    list_display = ('name', 'location', 'admin_profile', 'contact_phone', 'operating_hours', 'created_at') # Add admin_profile
    search_fields = ('name', 'location', 'admin_profile__user__username') # Search by admin username
    raw_id_fields = ('admin_profile',) # Use raw_id_fields

@admin.register(ProductType)
class ProductTypeAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')
    search_fields = ('name',)

@admin.register(InventoryItem)
class InventoryItemAdmin(admin.ModelAdmin):
    list_display = ('distribution_center', 'product_type', 'quantity', 'last_updated')
    list_filter = ('distribution_center', 'product_type')
    search_fields = ('distribution_center__name', 'product_type__name')
    list_editable = ('quantity',)
    raw_id_fields = ('distribution_center', 'product_type') # Use raw_id_fields for FKs

@admin.register(ProductRequest)
class ProductRequestAdmin(admin.ModelAdmin):
    # Include method to display requester and assigned center cleanly
    list_display = ('id', 'get_requester', 'product_type', 'quantity', 'status', 'assigned_distribution_center', 'created_at')
    list_filter = ('status', 'created_at', 'assigned_distribution_center', 'product_type')
    search_fields = ('requesting_organization__name', 'requester_user__username', 'requester_phone_number', 'product_type__name', 'assigned_distribution_center__name')
    readonly_fields = ('created_at', 'updated_at')
    # Allow editing status, assigned center, and pickup details via admin
    # fields = ('requesting_organization', 'requester_user', 'requester_phone_number', 'product_type', 'quantity', 'status', 'assigned_distribution_center', 'pickup_details', 'created_at', 'updated_at') # Example of custom fields
    raw_id_fields = ('requesting_organization', 'requester_user', 'assigned_distribution_center', 'product_type') # Use raw_id_fields for FKs


    # Helper method to display the requester cleanly (updated for UserProfile role)
    @admin.display(description='Requester')
    def get_requester(self, obj):
        requester = "Unknown Requester Type"
        if obj.requesting_organization:
            return f"Org: {obj.requesting_organization.name}"
        elif obj.requester_user:
            # Display the user's explicit profile role if available
             try:
                 user_profile = obj.requester_user.profile
                 return f"User ({user_profile.get_role_display()}): {obj.requester_user.username}"
             except UserProfile.DoesNotExist:
                   # Fallback if profile missing (shouldn't happen with signal)
                 return f"User (No Profile): {obj.requester_user.username}"
        elif obj.requester_phone_number:
            return f"SMS: {obj.requester_phone_number}"
        return "Unknown"