# api/admin.py

from django.contrib import admin
from .models import (
    Organization,
    DistributionCenter,
    ProductType,
    InventoryItem,
    ProductRequest
)

@admin.register(Organization)
class OrganizationAdmin(admin.ModelAdmin):
    list_display = ('name', 'location', 'contact_person', 'is_verified', 'created_at')
    list_filter = ('is_verified', 'location')
    search_fields = ('name', 'location', 'contact_person')

@admin.register(DistributionCenter)
class DistributionCenterAdmin(admin.ModelAdmin):
    list_display = ('name', 'location', 'contact_phone', 'operating_hours', 'created_at')
    search_fields = ('name', 'location')

@admin.register(ProductType)
class ProductTypeAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')
    search_fields = ('name',)

@admin.register(InventoryItem)
class InventoryItemAdmin(admin.ModelAdmin):
    list_display = ('distribution_center', 'product_type', 'quantity', 'last_updated')
    list_filter = ('distribution_center', 'product_type')
    search_fields = ('distribution_center__name', 'product_type__name')
    # Make quantity editable directly in the list view
    list_editable = ('quantity',)

@admin.register(ProductRequest)
class ProductRequestAdmin(admin.ModelAdmin):
    list_display = ('id', 'get_requester', 'product_type', 'quantity', 'status', 'assigned_distribution_center', 'created_at')
    list_filter = ('status', 'created_at', 'assigned_distribution_center', 'product_type')
    search_fields = ('requesting_organization__name', 'requester_phone_number', 'product_type__name')
    # Automatically set timestamps
    readonly_fields = ('created_at', 'updated_at')

    # Helper method to display the requester cleanly
    @admin.display(description='Requester')
    def get_requester(self, obj):
        if obj.requesting_organization:
            return obj.requesting_organization.name
        elif obj.requester_phone_number:
            return obj.requester_phone_number
        return "N/A"

    # Add actions like 'Mark as Ready', 'Mark as Fulfilled' later