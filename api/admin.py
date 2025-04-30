# api/admin.py

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User

from .models import (
    UserProfile,
    Organization,
    DistributionCenter,
    ProductType,
    InventoryItem,
    ProductRequest,
    USER_ROLE_CHOICES
)

# --- Customize User Admin to include UserProfile inline ---
class UserProfileInline(admin.StackedInline):
    model = UserProfile
    can_delete = False
    verbose_name_plural = 'Profile'
    # Add fields from UserProfile you want to edit directly on User page
    fields = ('role', 'location') # *** ADD LOCATION FIELD ***


# Define a new User admin (Keep existing)
class CustomUserAdmin(BaseUserAdmin):
    inlines = (UserProfileInline,)
    list_display = BaseUserAdmin.list_display + ('get_profile_role', 'is_org_admin_display', 'is_center_admin_display')
    list_filter = BaseUserAdmin.list_filter + ('profile__role',)

    def get_formsets_with_inlines(self, request, obj=None):
        for inline in self.get_inline_instances(request, obj):
            if isinstance(inline, UserProfileInline) and obj is None:
                 continue
            yield inline.get_formset(request, obj), inline

    @admin.display(description='Profile Role')
    def get_profile_role(self, obj):
        try:
            return obj.profile.get_role_display()
        except UserProfile.DoesNotExist:
            return "No Profile"

    @admin.display(description='Is Org Admin', boolean=True)
    def is_org_admin_display(self, obj):
        try:
            return hasattr(obj.profile, 'managed_organization') and obj.profile.managed_organization is not None
        except UserProfile.DoesNotExist:
            return False

    @admin.display(description='Is Center Admin', boolean=True)
    def is_center_admin_display(self, obj):
        try:
            return hasattr(obj.profile, 'managed_distribution_center') and obj.profile.managed_distribution_center is not None
        except UserProfile.DoesNotExist:
            return False

admin.site.unregister(User)
admin.site.register(User, CustomUserAdmin)


# --- Register other models (Keep existing) ---
@admin.register(Organization)
class OrganizationAdmin(admin.ModelAdmin):
    list_display = ('name', 'location', 'admin_profile', 'is_verified', 'created_at')
    list_filter = ('is_verified', 'location')
    search_fields = ('name', 'location', 'contact_person', 'admin_profile__user__username')
    raw_id_fields = ('admin_profile',)

@admin.register(DistributionCenter)
class DistributionCenterAdmin(admin.ModelAdmin):
    list_display = ('name', 'location', 'admin_profile', 'contact_phone', 'operating_hours', 'created_at')
    search_fields = ('name', 'location', 'admin_profile__user__username')
    raw_id_fields = ('admin_profile',)

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
    raw_id_fields = ('distribution_center', 'product_type')

@admin.register(ProductRequest)
class ProductRequestAdmin(admin.ModelAdmin):
    list_display = ('id', 'get_requester', 'product_type', 'quantity', 'status', 'assigned_distribution_center', 'created_at')
    list_filter = ('status', 'created_at', 'assigned_distribution_center', 'product_type')
    search_fields = ('requesting_organization__name', 'requester_user__username', 'requester_phone_number', 'product_type__name', 'assigned_distribution_center__name')
    readonly_fields = ('created_at', 'updated_at')
    raw_id_fields = ('requesting_organization', 'requester_user', 'assigned_distribution_center', 'product_type')

    @admin.display(description='Requester')
    def get_requester(self, obj):
        requester = "Unknown Requester Type"
        if obj.requesting_organization:
            return f"Org: {obj.requesting_organization.name}"
        elif obj.requester_user:
             try:
                 user_profile = obj.requester_user.profile
                 return f"User ({user_profile.get_role_display()}): {obj.requester_user.username}"
             except UserProfile.DoesNotExist:
                 return f"User (No Profile): {obj.requester_user.username}"
        elif obj.requester_phone_number:
            return f"SMS: {obj.requester_phone_number}"
        return "Unknown"