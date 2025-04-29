# api/models.py

from django.db import models
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.db.models.signals import post_save # Import signal
from django.dispatch import receiver # Import receiver for signals
# *** Import the Token model ***
from rest_framework.authtoken.models import Token


# *** Get the actual User model class ***
User = get_user_model()


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
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')

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

# --- Signal 1: Create UserProfile automatically when a new User is created ---
# This ensures every User has a linked UserProfile upon creation
@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        # Create profile with default role 'individual'
        UserProfile.objects.create(user=instance)
        # print(f"UserProfile created for {instance.username}") # Optional debug log


# --- Signal 2: Create an Auth Token automatically when a new User is created ---
# *** ADD THIS NEW SIGNAL BLOCK ***
# This is needed if REGISTER_AUTO_LOGIN is True and you use TokenAuthentication
@receiver(post_save, sender=User)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        # This fires *after* the user object (and its profile by the previous signal) is created.
        # Create a Token for the new user instance.
        Token.objects.create(user=instance)
        print(f"Auth Token created for user: {instance.username}") # Optional debug log
# *** END NEW SIGNAL BLOCK ***


# --- Signal to save UserProfile when User is saved ---
# *** This signal is REMOVED ***


# Update Organization and DistributionCenter to link to UserProfile
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


# Choices for Product Request Status
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
    # --- Requester Information (Only ONE should be set via perform_create logic in the view) ---
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