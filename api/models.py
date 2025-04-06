# api/models.py

from django.db import models
from django.contrib.auth.models import User # Import User model for linking later
from django.core.exceptions import ValidationError # Import for validation


# Choices for Request Status
REQUEST_STATUS_CHOICES = [
    ('Pending', 'Pending'),
    ('Ready', 'Ready for Pickup'),
    ('Fulfilled', 'Fulfilled'),
    ('Cancelled', 'Cancelled'),
]

# Choices for User Roles (will be refined later)
# We won't add this directly to User yet, maybe a profile model later
# For now, models below might link to User or just store basic info

class Organization(models.Model):
    # Link to a user who manages this org (optional for now, can be added later)
    admin_user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='managed_organizations')
    name = models.CharField(max_length=200)
    location = models.CharField(max_length=255, help_text="City, Area or specific address")
    contact_person = models.CharField(max_length=100, blank=True)
    contact_email = models.EmailField(blank=True)
    contact_phone = models.CharField(max_length=20, blank=True)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.location})"

class DistributionCenter(models.Model):
    # Link to a user who manages this center (optional for now)
    admin_user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='managed_centers')
    name = models.CharField(max_length=200)
    location = models.CharField(max_length=255, help_text="Full address for pickup")
    contact_email = models.EmailField(blank=True)
    contact_phone = models.CharField(max_length=20, blank=True)
    operating_hours = models.CharField(max_length=150, blank=True, help_text="e.g., Mon-Fri 9am-5pm")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.location})"

class ProductType(models.Model):
    name = models.CharField(max_length=100, unique=True) # e.g., 'Sanitary Pads (Regular)', 'Tampons (Super)'
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name

class InventoryItem(models.Model):
    distribution_center = models.ForeignKey(DistributionCenter, on_delete=models.CASCADE, related_name='inventory_items')
    product_type = models.ForeignKey(ProductType, on_delete=models.CASCADE, related_name='inventory_entries')
    quantity = models.PositiveIntegerField(default=0)
    last_updated = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('distribution_center', 'product_type') # Each center can only have one entry per product type

    def __str__(self):
        return f"{self.quantity} x {self.product_type.name} at {self.distribution_center.name}"

class ProductRequest(models.Model):
    # --- Requester Information (Only ONE should be filled) ---
    # 1. For Organizations (Web App)
    requesting_organization = models.ForeignKey(
        Organization,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='product_requests'
    )
    # 2. For Individual Users (Web App - Logged In)
    requester_user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='product_requests'
    )
    # 3. For Individual Users (SMS)
    requester_phone_number = models.CharField(
        max_length=20,
        blank=True, null=True,
        db_index=True,
        help_text="Used for requests originating from SMS"
    )
    # --- End Requester Information ---

    # What was requested?
    product_type = models.ForeignKey(ProductType, on_delete=models.PROTECT) # Don't delete product type if requests exist
    quantity = models.PositiveIntegerField()

    # Fulfillment Details
    status = models.CharField(max_length=20, choices=REQUEST_STATUS_CHOICES, default='Pending')
    assigned_distribution_center = models.ForeignKey(
        DistributionCenter,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='assigned_requests'
    )
    pickup_details = models.TextField(blank=True, help_text="Instructions for pickup, e.g., date/time/code")



    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def clean(self):
        """
        Ensure that exactly one requester type (org, user, phone) is set.
        """
        requester_fields = [
            self.requesting_organization,
            self.requester_user,
            self.requester_phone_number
        ]
        num_requesters_set = sum(1 for field in requester_fields if field)

        if num_requesters_set == 0:
            raise ValidationError("A request must have a requester (Organization, User, or Phone Number).")
        if num_requesters_set > 1:
            raise ValidationError("A request cannot have multiple requester types (Organization, User, Phone Number).")

    def save(self, *args, **kwargs):
        self.clean() # Run validation before saving
        super().save(*args, **kwargs)
    # --- End Model Validation ---

    def __str__(self):
        requester = "Unknown"
        if self.requesting_organization:
            requester = f"Org: {self.requesting_organization.name}"
        elif self.requester_user:
            requester = f"User: {self.requester_user.username}"
        elif self.requester_phone_number:
            requester = f"SMS: {self.requester_phone_number}"
        return f"Request for {self.quantity} x {self.product_type.name} by {requester} ({self.status})"

    