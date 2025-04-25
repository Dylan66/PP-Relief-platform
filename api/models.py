# api/models.py

from django.db import models
from django.contrib.auth.models import User # Import standard User model
from django.core.exceptions import ValidationError
from django.conf import settings # Import settings to get AUTH_USER_MODEL
from django.db.models.signals import post_save # Import signal
from django.dispatch import receiver # Import receiver for signals

# Use the user model specified in settings (defaults to django.contrib.auth.models.User)
AUTH_USER_MODEL = settings.AUTH_USER_MODEL

# Define choices for user roles
USER_ROLE_CHOICES = [
    ('individual', 'Individual Recipient'), # Can request products for themselves
    ('organization_admin', 'Organization Admin'), # Manages an organization's requests
    ('donor', 'Donor'),                       # Donates products or money
    ('center_admin', 'Distribution Center Admin'), # Manages a distribution center
    # 'system_admin' is covered by User.is_staff/is_superuser, no need for a separate role choice here
]


# New UserProfile Model to extend Django's User
class UserProfile(models.Model):
    # One-to-one link to the standard Django User model
    user = models.OneToOneField(AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='profile')

    # *** ADD EXPLICIT ROLE FIELD ***
    role = models.CharField(
        max_length=50,
        choices=USER_ROLE_CHOICES,
        default='individual', # Default role for new registrations
        help_text="Determines the user's primary function/dashboard in the system."
    )
    # *** END ADD EXPLICIT ROLE FIELD ***

    # Add other potential user-specific fields here later (e.g., preferred location, household size)

    def __str__(self):
        return f"Profile for {self.user.username} ({self.get_role_display()})"

# --- Signal to create UserProfile automatically when a new User is created ---
# This ensures every User has a linked UserProfile upon creation
@receiver(post_save, sender=AUTH_USER_MODEL)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        # Create profile with default role 'individual'
        UserProfile.objects.create(user=instance)
        # print(f"UserProfile created for {instance.username}") # Optional debug log

# This signal is often included, but the create signal handles it for new users.
# It might be needed if you manually create a User without the signal firing,
# or modify profile fields when saving the User.
@receiver(post_save, sender=AUTH_USER_MODEL)
def save_user_profile(sender, instance, **kwargs):
     # Ensure profile exists before trying to save it
     if hasattr(instance, 'profile'):
        try:
             # Use a try-except block in case the profile wasn't created properly initially
             instance.profile.save()
        except UserProfile.DoesNotExist:
             # This case should ideally be handled by create_user_profile, but as a fallback
             UserProfile.objects.create(user=instance)
             print(f"Warning: UserProfile created retroactively for {instance.username} during save signal.")


# Update Organization and DistributionCenter to link to UserProfile
# Use OneToOneField here if one Org/Center = one admin profile is the intended model
# Use ForeignKey if one admin profile can manage multiple Orgs/Centers
# Let's stick with OneToOneField as in previous steps, ensuring admin_profile is nullable.
class Organization(models.Model):
    # Link to the UserProfile of the admin user for this organization
    # Setting null=True, blank=True allows organizations to exist without a linked admin initially
    admin_profile = models.OneToOneField(
        UserProfile,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='managed_organization' # Use reverse relation 'managed_organization' on UserProfile
    )
    name = models.CharField(max_length=200)
    location = models.CharField(max_length=255, help_text="City, Area or specific address")
    contact_person = models.CharField(max_length=100, blank=True)
    contact_email = models.EmailField(blank=True)
    contact_phone = models.CharField(max_length=20, blank=True)
    is_verified = models.BooleanField(default=False) # For admin verification
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


    def __str__(self):
        return f"{self.name} ({self.location})"

class DistributionCenter(models.Model):
    # Link to the UserProfile of the admin user for this center
    admin_profile = models.OneToOneField(
        UserProfile,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='managed_distribution_center' # Use reverse relation 'managed_distribution_center' on UserProfile
    )
    name = models.CharField(max_length=200)
    location = models.CharField(max_length=255, help_text="Full address for pickup")
    contact_email = models.EmailField(blank=True)
    contact_phone = models.CharField(max_length=20, blank=True)
    operating_hours = models.CharField(max_length=150, blank=True, help_text="e.g., Mon-Fri 9am-5pm")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


    def __str__(self):
        return f"{self.name} ({self.location})"


# Choices for Product Request Status
REQUEST_STATUS_CHOICES = [
    ('Pending', 'Pending'),
    ('Ready', 'Ready for Pickup'),
    ('Fulfilled', 'Fulfilled'),
    ('Cancelled', 'Cancelled'),
]

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
        verbose_name_plural = "Inventory Items" # Fix plural in admin

    def __str__(self):
        return f"{self.quantity} x {self.product_type.name} at {self.distribution_center.name}"

class ProductRequest(models.Model):
    # --- Requester Information (Only ONE should be set via perform_create logic in the view) ---
    # 1. For Organizations (Web App) - Linked to the Organization itself
    requesting_organization = models.ForeignKey(
        Organization,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='product_requests'
    )
    # 2. For Individual Users (Web App - Logged In) - Linked to the User object
    requester_user = models.ForeignKey(
        AUTH_USER_MODEL, # Link to the configured Auth User model
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='product_requests'
    )
    # 3. For Individual Users (SMS) - Stored as phone number
    requester_phone_number = models.CharField(
        max_length=20,
        blank=True, null=True,
        db_index=True,
        help_text="Used for requests originating from SMS"
    )
    # --- End Requester Information ---

    # What was requested?
    product_type = models.ForeignKey(ProductType, on_delete=models.PROTECT)
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

    # --- Model Validation ---
    def clean(self):
        """
        Ensure that exactly one primary requester type (org, user, phone) is set.
        This validation relies on the perform_create logic setting *only one* of these fields.
        """
        requester_fields_set = [
            self.requesting_organization is not None,
            self.requester_user is not None, # User is set for individual web requests
            self.requester_phone_number not in [None, ''] # Phone number is set for SMS requests
        ]

        num_requesters_set = sum(requester_fields_set)

        if num_requesters_set == 0:
            # This case should ideally be prevented by form/serializer validation requiring at least quantity/product type
            raise ValidationError("A request must have a requester (Organization, User, or Phone Number).")
        if num_requesters_set > 1:
            # This prevents saving if multiple fields are accidentally set
            raise ValidationError("A request cannot have multiple primary requester types.")

    def save(self, *args, **kwargs):
        self.clean() # Run validation before saving
        super().save(*args, **kwargs)

    def __str__(self):
        requester = "Unknown Requester Type"
        if self.requesting_organization:
            requester = f"Org: {self.requesting_organization.name}"
        elif self.requester_user:
            requester = f"User: {self.requester_user.username}"
        elif self.requester_phone_number:
            requester = f"SMS: {self.requester_phone_number}"
        return f"Request for {self.quantity} x {self.product_type.name} by {requester} ({self.status})"