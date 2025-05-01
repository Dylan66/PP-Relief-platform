# api/models.py

from django.db import models
from django.contrib.auth import get_user_model # Import standard User model
from django.core.exceptions import ValidationError
from django.db.models.signals import post_save # Import signal
from django.dispatch import receiver # Import receiver for signals
from rest_framework.authtoken.models import Token 
# Get the actual User model class
User = get_user_model()


# Define choices for user roles
USER_ROLE_CHOICES = [
    ('individual', 'Individual Recipient'),
    ('organization_admin', 'Organization Admin'),
    ('donor', 'Donor'),
    ('center_admin', 'Distribution Center Admin'),
]


# New UserProfile Model to extend Django's User
class UserProfile(models.Model):
    # One-to-one link to the standard Django User model
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')

    # *** ADD EXPLICIT ROLE FIELD ***
    role = models.CharField(
        max_length=50,
        choices=USER_ROLE_CHOICES,
        default='individual', # Default role for new registrations
        help_text="Determines the user's primary function/dashboard in the system."
    )
    # *** END ADD EXPLICIT ROLE FIELD ***

    # *** ADD LOCATION FIELD TO USERPROFILE ***
    location = models.CharField(
        max_length=255,
        blank=True, # Make location optional initially
        help_text="Location for individuals or primary location for donors/admins."
    )
    # *** END ADD LOCATION FIELD ***

    # Add other potential user-specific fields here later

    def __str__(self):
        return f"Profile for {self.user.username} ({self.get_role_display()})"

# --- Signal to create UserProfile automatically when a new User is created ---
@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)

# --- No save_user_profile signal needed ---
# --- ADD Signal to create Auth Token automatically ---
# This signal is triggered AFTER a User object is saved.
# It runs IN ADDITION TO the create_user_profile signal.
@receiver(post_save, sender=User)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        # Check if a token already exists for this user (shouldn't for new users created here)
        # This check is mostly for safety if you have existing users or rerun migrations oddly.
        if not Token.objects.filter(user=instance).exists():
            Token.objects.create(user=instance)
            print(f"Auth Token created for new user: {instance.username}") # Optional debug log
# *** END ADD Signal ***

# Update Organization and DistributionCenter to link to UserProfile (Keep existing)
class Organization(models.Model):
    admin_profile = models.OneToOneField(
        UserProfile,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='managed_organization'
    )
    name = models.CharField(max_length=200)
    location = models.CharField(max_length=255, help_text="City, Area or specific address")
    contact_person = models.CharField(max_length=100, blank=True)
    contact_email = models.EmailField(blank=True)
    contact_phone = models.CharField(max_length=20, blank=True)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


    def __str__(self):
        return f"{self.name} ({self.location})"

class DistributionCenter(models.Model):
    admin_profile = models.OneToOneField(
        UserProfile,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='managed_distribution_center'
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


# Choices for Product Request Status (Keep existing)
REQUEST_STATUS_CHOICES = [
    ('Pending', 'Pending'),
    ('Ready', 'Ready for Pickup'),
    ('Fulfilled', 'Fulfilled'),
    ('Cancelled', 'Cancelled'),
]

class ProductType(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name

class InventoryItem(models.Model):
    distribution_center = models.ForeignKey(DistributionCenter, on_delete=models.CASCADE, related_name='inventory_items')
    product_type = models.ForeignKey(ProductType, on_delete=models.CASCADE, related_name='inventory_entries')
    quantity = models.PositiveIntegerField(default=0)
    last_updated = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('distribution_center', 'product_type')
        verbose_name_plural = "Inventory Items"

    def __str__(self):
        return f"{self.quantity} x {self.product_type.name} at {self.distribution_center.name}"

class ProductRequest(models.Model):
    # --- Requester Information (Keep existing) ---
    requesting_organization = models.ForeignKey(
        Organization,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='product_requests'
    )
    requester_user = models.ForeignKey(
        User, # Link to the configured Auth User model
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='product_requests'
    )
    requester_phone_number = models.CharField(
        max_length=20,
        blank=True, null=True,
        db_index=True,
        help_text="Used for requests originating from SMS"
    )
    # --- End Requester Information ---

    # What was requested? (Keep existing)
    product_type = models.ForeignKey(ProductType, on_delete=models.PROTECT)
    quantity = models.PositiveIntegerField()

    # Fulfillment Details (Keep existing)
    status = models.CharField(max_length=20, choices=REQUEST_STATUS_CHOICES, default='Pending')
    assigned_distribution_center = models.ForeignKey(
        DistributionCenter,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='assigned_requests'
    )
    pickup_details = models.TextField(blank=True, help_text="Instructions for pickup, e.g., date/time/code")

    # Timestamps (Keep existing)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # --- Model Validation (Keep existing) ---
    def clean(self):
        requester_fields_set = [
            self.requesting_organization is not None,
            self.requester_user is not None,
            self.requester_phone_number not in [None, '']
        ]
        num_requesters_set = sum(requester_fields_set)

        if num_requesters_set == 0:
            raise ValidationError("A request must have a requester (Organization, User, or Phone Number).")
        if num_requesters_set > 1:
            raise ValidationError("A request cannot have multiple primary requester types.")

    def save(self, *args, **kwargs):
        self.clean()
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