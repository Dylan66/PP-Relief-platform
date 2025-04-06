# api/views.py

from rest_framework import generics, permissions, status # Import generics
from rest_framework.response import Response
from .serializers import UserSerializer # Import UserSerializer
from rest_framework.response import Response


from .models import (
    Organization,
    DistributionCenter,
    ProductType,
    InventoryItem,
    ProductRequest
)
from .serializers import (
    OrganizationSerializer,
    DistributionCenterSerializer,
    ProductTypeSerializer,
    InventoryItemSerializer,
    ProductRequestSerializer
)

# --- Public/General Read-Only Views ---

class ProductTypeListAPIView(generics.ListAPIView):
    """
    API endpoint that allows Product Types to be viewed.
    """
    queryset = ProductType.objects.all()
    serializer_class = ProductTypeSerializer
    permission_classes = [permissions.AllowAny] # Anyone can see product types

class DistributionCenterListAPIView(generics.ListAPIView):
    """
    API endpoint that allows Distribution Centers to be viewed.
    Used for showing drop-off locations or potential pickup points.
    """
    queryset = DistributionCenter.objects.all()
    serializer_class = DistributionCenterSerializer
    permission_classes = [permissions.AllowAny] # Anyone can see centers

class CurrentUserAPIView(generics.RetrieveAPIView):
    """
    Get the details of the currently logged-in user.
    """
    permission_classes = [permissions.IsAuthenticated] # Must be logged in
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user # Return the user object associated with the request


# --- Organization Views (Requires Login Later) ---

class OrganizationListCreateAPIView(generics.ListCreateAPIView):
    """
    API endpoint that allows Organizations to be listed (maybe admin only?)
    and new Organizations to be created (registration).
    """
    queryset = Organization.objects.all() # TODO: Filter based on user later?
    serializer_class = OrganizationSerializer
    # TODO: Change permissions later (e.g., IsAuthenticatedOrReadOnly for list, AllowAny for create?)
    permission_classes = [permissions.IsAuthenticatedOrReadOnly] # For now, allow anyone to list/create

# --- Product Request Views (Requires Login Later) ---

class ProductRequestListCreateAPIView(generics.ListCreateAPIView):
    """
    API endpoint for Organizations to create new requests
    and view their existing requests.
    """
    serializer_class = ProductRequestSerializer
    # TODO: Add permissions (e.g., IsAuthenticated)
    permission_classes = [permissions.IsAuthenticated] # For now

    def get_queryset(self):
        """
        Filter requests:
        - If user is linked to an Organization, show that Org's requests.
        - Otherwise, show the individual user's requests.
        - Superusers/staff see all requests.
        """
        user = self.request.user
        if user.is_staff or user.is_superuser:
            return ProductRequest.objects.all().order_by('-created_at')

        # Check if user is linked to an organization profile
        try:
            # Use the related_name from Organization model's admin_user field
            org_profile = user.organization_profile
            if org_profile:
                return ProductRequest.objects.filter(requesting_organization=org_profile).order_by('-created_at')
        except User.organization_profile.RelatedObjectDoesNotExist:
             # No organization profile, so it's an individual user's request
            pass

        # If not staff and not linked to an Org, filter by individual user
        return ProductRequest.objects.filter(requester_user=user).order_by('-created_at')

    def perform_create(self, serializer):
        """
        Automatically set the requester based on the logged-in user.
        """
        user = self.request.user
        # Check if user is linked to an organization profile
        try:
            org_profile = user.organization_profile
            if org_profile:
                 # Check permissions here if needed (e.g., is org verified?)
                serializer.save(requesting_organization=org_profile)
                return # Exit after saving
        except User.organization_profile.RelatedObjectDoesNotExist:
            # No organization profile, proceed to save as individual user request
            pass
        except AttributeError:
             # Handle cases where organization_profile might not exist on user
             # This might happen if the OneToOneField relationship was added later
            pass


        # If not linked to an organization, save as an individual user's request
        # Ensure user is not anonymous (though permission_classes should prevent this)
        if user.is_authenticated:
             # Note: The ProductRequestSerializer now has 'requester_user' as read_only
             # We pass it directly to the save method here.
            serializer.save(requester_user=user)
        else:
            # This case should ideally not be reached due to permission_classes
            # You might raise an exception or handle it as an error
            raise serializers.ValidationError("User must be logged in to create a request.")



class ProductRequestRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    """
    API endpoint for retrieving, updating (e.g., status by center admin),
    or deleting a specific product request.
    """
    serializer_class = ProductRequestSerializer
    # TODO: Implement more granular permissions (IsOwner, IsCenterAdmin, IsAdmin)
    permission_classes = [permissions.IsAuthenticated] # Base permission

    def get_queryset(self):
        """
        Users should only be able to retrieve/update/delete requests
        they own or manage, unless they are staff/admin.
        """
        user = self.request.user
        if user.is_staff or user.is_superuser:
            return ProductRequest.objects.all()

        # Check organization linkage
        try:
            org_profile = user.organization_profile
            if org_profile:
                # Or filter allows user to see org requests OR their own individual requests
                return ProductRequest.objects.filter(
                    models.Q(requesting_organization=org_profile) | models.Q(requester_user=user)
                )
        except User.organization_profile.RelatedObjectDoesNotExist:
             pass
        except AttributeError:
             pass


        # Default to only individual user's requests
        return ProductRequest.objects.filter(requester_user=user)

    # TODO: Add permission checks inside update/partial_update/destroy methods
    # to prevent users from updating requests they don't own, or prevent
    # requesters from changing the status (only center admins should do that).

   

# --- Inventory Views (Requires Center Admin Login Later) ---

class InventoryItemListAPIView(generics.ListAPIView):
    """
    API endpoint to list inventory items. Can be filtered by distribution center.
    """
    serializer_class = InventoryItemSerializer
    # TODO: Add permissions (e.g., IsCenterAdminOrReadOnly)
    permission_classes = [permissions.IsAuthenticated] # For now

    def get_queryset(self):
        queryset = InventoryItem.objects.all()
        # Allow filtering by distribution center ID passed as a query parameter
        # Example: /api/inventory/?center_id=1
        center_id = self.request.query_params.get('center_id', None)
        if center_id is not None:
            queryset = queryset.filter(distribution_center_id=center_id)
        return queryset

class InventoryItemRetrieveUpdateAPIView(generics.RetrieveUpdateAPIView):
    """
    API endpoint to retrieve or update the quantity of a specific inventory item.
    Typically used by Distribution Center Admins.
    """
    queryset = InventoryItem.objects.all()
    serializer_class = InventoryItemSerializer
    # TODO: Add permissions (e.g., IsCenterAdmin for this item)
    permission_classes = [permissions.IsAuthenticated] # For now

    # Ensure only quantity can be updated easily via PUT/PATCH by center admins
    def get_serializer(self, *args, **kwargs):
        kwargs['partial'] = True # Allow partial updates (PATCH)
        return super().get_serializer(*args, **kwargs)

    # Optional: Could override update to prevent changing product_type or distribution_center
    #           once an item is created, only allowing quantity updates.

# --- SMS Webhook View Placeholder ---
# We'll add the real logic later in Phase 3

from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST

@csrf_exempt # Disable CSRF for webhook, rely on gateway signature validation later
@require_POST # Ensure only POST requests are accepted
def sms_webhook(request):
    # TODO: Implement SMS receiving logic here
    # 1. Validate request comes from Twilio/Gateway (using signature)
    # 2. Parse incoming message (From number, Body content)
    # 3. Determine action (REGISTER, REQUEST, DONATE)
    # 4. Perform action (create user, create request, etc.)
    # 5. Send response back to gateway (TwiML for Twilio) to reply via SMS
    print("SMS Webhook received!") # Placeholder log
    print(f"From: {request.POST.get('From')}")
    print(f"Body: {request.POST.get('Body')}")

    # Example Twilio response (replace with actual logic)
    # response = '<Response><Message>Thanks for your message!</Message></Response>'
    # return HttpResponse(response, content_type='text/xml')

    return HttpResponse("Webhook received.", status=200) # Simple HTTP 200 OK for now