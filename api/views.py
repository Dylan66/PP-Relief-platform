# api/views.py

from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied, ValidationError as DRFValidationError # Import DRF Validation Error
from django.contrib.auth import get_user_model
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.http import HttpResponse
from django.db import models as django_models

from .models import (
    UserProfile, # Import UserProfile
    Organization,
    DistributionCenter,
    ProductType,
    InventoryItem,
    ProductRequest,
    USER_ROLE_CHOICES # Import role choices
)
from .serializers import (
    ProductTypeSerializer,
    DistributionCenterSerializer,
    InventoryItemSerializer,
    ProductRequestSerializer,
    CustomUserDetailsSerializer,
    OrganizationSerializer # Import OrganizationSerializer
)

User = get_user_model()

# --- Public/General Read-Only Views ---

class ProductTypeListAPIView(generics.ListAPIView):
    """
    API endpoint that allows Product Types to be viewed by anyone.
    """
    queryset = ProductType.objects.all()
    serializer_class = ProductTypeSerializer
    permission_classes = [permissions.AllowAny]


class DistributionCenterListAPIView(generics.ListAPIView):
    """
    API endpoint that allows Distribution Centers to be viewed by anyone.
    Used for showing drop-off locations or potential pickup points.
    """
    queryset = DistributionCenter.objects.all()
    serializer_class = DistributionCenterSerializer
    permission_classes = [permissions.AllowAny]


# --- Organization Views (Requires Authentication & potentially Admin role) ---

class OrganizationListCreateAPIView(generics.ListCreateAPIView):
    """
    API endpoint that allows Organizations to be listed and created.
    Creation is likely for registration (AllowAny), Listing might be restricted (IsAdminUser?).
    """
    queryset = Organization.objects.all()
    serializer_class = OrganizationSerializer

    # Permissions: Authenticated users can list. Unauthenticated users cannot list.
    # Creation: Allow any user? Or restrict? For MVP, let's require authentication to create.
    # Real-world: Maybe a separate 'Org Registration' flow, or only System Admins create Orgs.
    permission_classes = [permissions.IsAuthenticatedOrReadOnly] # Authenticated can list, any can read. CanAuthenticated create?

    def post(self, request, *args, **kwargs):
        """Override POST to enforce creation permission."""
        # Only System Admins/Staff can create Organizations via this endpoint
        if not (request.user.is_authenticated and (request.user.is_staff or request.user.is_superuser)):
             raise PermissionDenied("You do not have permission to create an organization.")
        return super().post(request, *args, **kwargs)

    # If you allow linking an admin_profile on creation via payload (System Admin task):
    # def perform_create(self, serializer):
    #     admin_profile_id = self.request.data.get('admin_profile')
    #     admin_profile = None
    #     if admin_profile_id:
    #          try:
    #               admin_profile = UserProfile.objects.get(id=admin_profile_id)
    #          except UserProfile.DoesNotExist:
    #               raise DRFValidationError({"admin_profile": "Invalid UserProfile ID."})
    #     serializer.save(admin_profile=admin_profile)


# --- Product Request Views (Requires Authentication & Role-based Logic) ---

class ProductRequestListCreateAPIView(generics.ListCreateAPIView):
    """
    API endpoint for authenticated users/organizations to create new requests
    and view their existing requests.
    Permissions: IsAuthenticated. Logic in get_queryset and perform_create.
    """
    serializer_class = ProductRequestSerializer
    permission_classes = [permissions.IsAuthenticated] # Must be logged in

    def get_queryset(self):
        """
        Filter requests based on the logged-in user's explicit role.
        System Admins/Staff see all. Other roles see specific requests.
        """
        user = self.request.user
        # System Admins/Staff see all requests
        if user.is_staff or user.is_superuser:
            print(f"User {user.username} is staff/superuser, returning all requests.")
            return ProductRequest.objects.all().order_by('-created_at')

        # Check the explicit role from the user's profile
        user_role = None
        user_profile = None
        try:
            user_profile = user.profile
            user_role = user_profile.role
            print(f"User {user.username} (Role: {user_role}) is requesting request list.")
        except UserProfile.DoesNotExist:
             print(f"User {user.username} has no profile. Denying request list.")
             raise PermissionDenied("User profile missing.") # Deny if profile is unexpectedly missing
        except AttributeError: # Should not happen with signal, but defensive
             print(f"User {user.username} profile lookup failed (AttributeError). Denying request list.")
             raise PermissionDenied("User profile lookup failed.")


        # Route based on explicit role for viewing lists
        if user_role == 'organization_admin':
             # Find the organization managed by this admin profile
             try:
                 managed_org = user_profile.managed_organization # Access via related_name
                 if managed_org:
                      print(f"User {user.username} (Org Admin) returning requests for Org ID {managed_org.id}")
                      return ProductRequest.objects.filter(requesting_organization=managed_org).order_by('-created_at')
                 else:
                      # Org Admin role but not linked to an organization? Problematic state.
                      print(f"User {user.username} (Org Admin) has no linked organization. Returning empty request list.")
                      return ProductRequest.objects.none()
             except Organization.DoesNotExist: # Should not happen with OneToOneField and proper link
                  print(f"User {user.username} (Org Admin) linked organization does not exist. Returning empty list.")
                  return ProductRequest.objects.none()
             except AttributeError: # Should not happen if managed_organization relation exists
                  print(f"User {user.username} (Org Admin) 'managed_organization' attribute missing on profile. Returning empty list.")
                  return ProductRequest.objects.none()


        elif user_role == 'individual':
             # Individual users see requests linked to their User model
             print(f"User {user.username} ('individual') returning requests linked to their user.")
             return ProductRequest.objects.filter(requester_user=user).order_by('-created_at')

        elif user_role == 'center_admin':
             # Center Admins will likely have a separate view for requests assigned to their center.
             # They don't see all requests or org/individual requests in this list.
             print(f"User {user.username} ('center_admin') does not see requests in this list view. Returning empty list.")
             return ProductRequest.objects.none()

        # Donors don't manage or view requests via this endpoint
        # Any other unhandled roles also get an empty list
        print(f"User {user.username} with role '{user_role}' does not grant access to this request list. Returning empty list.")
        return ProductRequest.objects.none() # Empty queryset for other roles

    def perform_create(self, serializer):
        """
        Automatically set the requester based on the logged-in user's explicit role.
        A request must be either for an Organization ('organization_admin' role) or by an Individual User ('individual' role).
        The request payload should *not* include 'requesting_organization', 'requester_user', or 'requester_phone_number' IDs for standard users creating requests.
        """
        user = self.request.user

        # Validate that the request body does NOT try to set the requester FKs directly (standard users)
        if any([serializer.validated_data.get('requesting_organization'),
                serializer.validated_data.get('requester_user'),
                serializer.validated_data.get('requester_phone_number')]):
             print(f"User {user.username} attempted to set requester FKs directly in create payload.")
             raise DRFValidationError("Cannot specify requester organization, user, or phone number in the request payload.")

        user_role = None
        user_profile = None
        try:
            user_profile = user.profile
            user_role = user_profile.role
            print(f"User {user.username} attempting to create request with role: {user_role}")
        except UserProfile.DoesNotExist:
             print(f"User {user.username} has no profile. Denying request creation.")
             raise PermissionDenied("User profile missing. Cannot create request.")
        except AttributeError:
             print(f"User {user.username} profile lookup failed (AttributeError). Denying request creation.")
             raise PermissionDenied("User profile lookup failed.")


        # Route creation logic based on explicit role
        if user_role == 'organization_admin':
             # Find the organization managed by this admin profile
             try:
                 managed_org = user_profile.managed_organization # Access via related_name
                 if managed_org is None:
                      print(f"User {user.username} has role 'organization_admin' but no linked organization.")
                      raise DRFValidationError("Your organization admin profile is not linked to an organization.") # More specific error
                 # Link the request to their organization
                 print(f"Creating Org Request for: {managed_org.name} by user {user.username}")
                 serializer.save(requesting_organization=managed_org)
                 return # Exit after saving

             except Organization.DoesNotExist: # Should not happen with OneToOneField
                 print(f"User {user.username} has role 'organization_admin' but linked organization does not exist.")
                 raise DRFValidationError("Linked organization not found.") # Error state

        elif user_role == 'individual':
             # Individual users make requests linked to their User model
             print(f"Creating Individual Web Request by user: {user.username}")
             serializer.save(requester_user=user) # Link to the logged-in User
             return # Exit after saving

        else:
             # Donors, Center Admins, etc., cannot create requests via this endpoint
             print(f"User {user.username} with role '{user_role}' is not authorized to create requests via this endpoint.")
             raise PermissionDenied("You do not have permission to create this type of request.")


class ProductRequestRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    """
    API endpoint for retrieving, updating, or deleting a specific product request.
    Permissions: IsAuthenticated + custom object-level logic in get_queryset/methods.
    """
    serializer_class = ProductRequestSerializer
    # TODO: Implement more granular object-level permissions here or in methods
    permission_classes = [permissions.IsAuthenticated] # Base permission

    def get_queryset(self):
        """
        Ensure users can only retrieve requests they are authorized to see (same logic as list view).
        """
        user = self.request.user
        # System Admins/Staff see all requests
        if user.is_staff or user.is_superuser:
            return ProductRequest.objects.all()

        # Check explicit role for retrieval permissions
        user_role = None
        user_profile = None
        try:
            user_profile = user.profile
            user_role = user_profile.role
            print(f"User {user.username} (Role: {user_role}) is requesting specific request.")
        except UserProfile.DoesNotExist:
             print(f"User {user.username} has no profile. Denying specific request.")
             raise PermissionDenied("User profile missing.")
        except AttributeError:
             print(f"User {user.username} profile lookup failed (AttributeError). Denying specific request.")
             raise PermissionDenied("User profile lookup failed.")


        if user_role == 'organization_admin':
             try:
                 managed_org = user_profile.managed_organization
                 if managed_org:
                      # Org Admin can retrieve requests for their organization OR requests linked directly to their user (less common)
                      print(f"User {user.username} (Org Admin) retrieving specific request for their org or user.")
                      return ProductRequest.objects.filter(
                          django_models.Q(requesting_organization=managed_org) |
                          django_models.Q(requester_user=user) # Include requests they made personally if any
                      )
                 else:
                      # Org Admin role but no linked org, can still retrieve requests made personally
                      print(f"User {user.username} (Org Admin) with no linked org retrieving specific request linked to their user.")
                      return ProductRequest.objects.filter(requester_user=user)
             except Exception as e: # Catch potential issues with managed_organization lookup
                  print(f"Error retrieving specific Org Admin request for user {user.username}: {e}")
                  return ProductRequest.objects.filter(requester_user=user) # Fallback to individual requests

        elif user_role == 'individual':
             # Individual users can retrieve requests linked to their User model
             print(f"User {user.username} ('individual') retrieving specific request linked to their user.")
             return ProductRequest.objects.filter(requester_user=user)

        elif user_role == 'center_admin':
             try:
                 managed_center = user_profile.managed_distribution_center
                 if managed_center:
                      # Center Admin can retrieve requests assigned to their center
                      print(f"User {user.username} ('center_admin') retrieving specific request assigned to their center.")
                      return ProductRequest.objects.filter(assigned_distribution_center=managed_center)
                 else:
                      # Center Admin role but no linked center
                      print(f"User {user.username} ('center_admin') with no linked center. Denying specific request.")
                      return ProductRequest.objects.none()
             except Exception as e: # Catch potential issues with managed_center lookup
                  print(f"Error retrieving specific Center Admin request for user {user.username}: {e}")
                  return ProductRequest.objects.none()

        # Donors and other roles cannot retrieve specific requests via this endpoint
        print(f"User {user.username} with role '{user_role}' is not authorized to retrieve specific requests.")
        return ProductRequest.objects.none() # Deny access

    # TODO: Override update, partial_update, and destroy methods to implement object-level permissions.
    # These checks would need to ensure the user has the *correct role* AND manages/owns the specific request instance.
    # For example, update would check:
    # - Is user System Admin? -> Always allow.
    # - Is user Center Admin AND is their managed_distribution_center the one linked to request.assigned_distribution_center? -> Allow updating status/pickup_details.
    # - Is user Org Admin AND is their managed_organization the one linked to request.requesting_organization? -> Maybe allow cancelling status?
    # - Is user Individual AND is request.requester_user == user? -> Maybe allow cancelling?
    # - Otherwise -> Raise PermissionDenied.
    # If update/delete is not intended for requesters, you can remove/simplify these methods.

    # Example of allowing specific roles to update STATUS and PICKUP_DETAILS for assigned requests
    # def update(self, request, *args, **kwargs):
    #      instance = self.get_object() # Gets the object using get_queryset filtering
    #      user = request.user
    #      user_role = None
    #      try: user_role = user.profile.role except UserProfile.DoesNotExist: pass
    #
    #      if not (user.is_staff or user.is_superuser or user_role == 'system_admin'):
    #           # If not System Admin, check if Center Admin updating assigned request
    #           is_center_admin_for_assigned_request = False
    #           if user_role == 'center_admin' and instance.assigned_distribution_center:
    #                try:
    #                     managed_center = user.profile.managed_distribution_center
    #                     if managed_center == instance.assigned_distribution_center:
    #                          is_center_admin_for_assigned_request = True
    #                except Exception: pass # Handle potential lookup errors
    #
    #           if not is_center_admin_for_assigned_request:
    #                raise PermissionDenied("You do not have permission to update this request.")
    #
    #      # Only allow updating specific fields for Center Admins
    #      update_data = {}
    #      if user_role == 'center_admin':
    #           allowed_fields = ['status', 'pickup_details']
    #           # Filter validated data to only include allowed fields
    #           update_data = {k: v for k, v in serializer.validated_data.items() if k in allowed_fields}
    #      elif user.is_staff or user.is_superuser or user_role == 'system_admin':
    #           # System admins can update any field
    #           update_data = serializer.validated_data
    #      else:
    #           # Should be caught by PermissionDenied above, but defensive
    #           raise PermissionDenied("Invalid role or permission for update.")
    #
    #      if not update_data:
    #           raise DRFValidationError("No valid fields provided for update.")
    #
    #      serializer.save(**update_data)
    #      return Response(serializer.data) # Return updated data
    #
    # def destroy(self, request, *args, **kwargs):
    #      instance = self.get_object() # Gets the object using get_queryset filtering
    #      user = request.user
    #      # Only System Admins can delete requests
    #      if not (user.is_staff or user.is_superuser or (hasattr(user, 'profile') and user.profile.role == 'system_admin')):
    #           raise PermissionDenied("You do not have permission to delete this request.")
    #      return super().destroy(request, *args, **kwargs)


# --- Inventory Views (Requires Authentication & Center Admin Role) ---

class InventoryItemListAPIView(generics.ListAPIView):
    """
    API endpoint to list inventory items. Can be filtered by distribution center ID.
    Requires: IsAuthenticated + specific role (System Admin or Center Admin).
    """
    serializer_class = InventoryItemSerializer
    permission_classes = [permissions.IsAuthenticated] # Require login

    def get_queryset(self):
        queryset = InventoryItem.objects.all()

        user = self.request.user
        user_role = None
        user_profile = None
        try:
            user_profile = user.profile
            user_role = user_profile.role
            print(f"User {user.username} (Role: {user_role}) is requesting inventory list.")
        except UserProfile.DoesNotExist:
             print(f"User {user.username} has no profile. Denying inventory list.")
             raise PermissionDenied("User profile missing. Cannot view inventory.")
        except AttributeError:
             print(f"User {user.username} profile lookup failed (AttributeError). Denying inventory list.")
             raise PermissionDenied("User profile lookup failed.")


        # System Admins can see all inventory (optionally filtered by center_id query param)
        if user.is_staff or user.is_superuser or user_role == 'system_admin': # Include custom role if you add it
             center_id = self.request.query_params.get('center_id', None)
             if center_id is not None:
                  print(f"Admin/Staff user {user.username} filtering inventory by center_id={center_id}")
                  return queryset.filter(distribution_center_id=center_id).order_by('distribution_center__name', 'product_type__name')
             print(f"Admin/Staff user {user.username} listing all inventory.")
             return queryset.order_by('distribution_center__name', 'product_type__name')

        # Center Admins can ONLY see inventory for *their* assigned center
        if user_role == 'center_admin':
            try:
                managed_center = user_profile.managed_distribution_center # Access via related_name
                if managed_center:
                     # Ignore the center_id query param if the user is a Center Admin, enforce their center
                     print(f"User {user.username} is Center Admin, filtering inventory for Center ID {managed_center.id}")
                     return queryset.filter(distribution_center=managed_center).order_by('product_type__name')
                else:
                     # Center Admin role but not linked to a center
                     print(f"User {user.username} has role 'center_admin' but no linked center. Returning empty inventory list.")
                     return InventoryItem.objects.none()
            except Exception as e: # Catch potential issues with managed_distribution_center lookup
                 print(f"Error retrieving Inventory for user {user.username}: {e}")
                 return InventoryItem.objects.none()


        # Other roles ('individual', 'organization_admin', 'donor') cannot list inventory via this endpoint
        print(f"User {user.username} with role '{user_role}' is not authorized to list inventory. Denying access.")
        raise PermissionDenied("You do not have permission to view inventory.")


class InventoryItemRetrieveUpdateAPIView(generics.RetrieveUpdateAPIView):
    """
    API endpoint to retrieve or update the quantity of a specific inventory item.
    Requires: IsAuthenticated + IsCenterAdmin for this specific item's center OR System Admin.
    """
    queryset = InventoryItem.objects.all()
    serializer_class = InventoryItemSerializer
    # TODO: Implement custom permission logic here or in methods
    permission_classes = [permissions.IsAuthenticated] # Base permission

    def get_serializer(self, *args, **kwargs):
        kwargs['partial'] = True # Allow partial updates (PATCH) for quantity
        return super().get_serializer(*args, **kwargs)

    def perform_update(self, serializer):
        # Implement permission and update logic here:
        user = self.request.user
        inventory_item = self.get_object() # Gets the object using get_queryset filtering

        user_role = None
        try: user_profile = user.profile; user_role = user_profile.role
        except UserProfile.DoesNotExist: raise PermissionDenied("User profile missing.")
        except AttributeError: raise PermissionDenied("User profile lookup failed.")

        # Check permissions
        if not (user.is_staff or user.is_superuser or user_role == 'system_admin'): # Check built-in or custom admin role
            # If not System Admin, check if Center Admin updating *their* assigned center's inventory
            is_center_admin_for_this_center = False
            if user_role == 'center_admin':
                 try:
                      managed_center = user_profile.managed_distribution_center
                      if managed_center == inventory_item.distribution_center:
                           is_center_admin_for_this_center = True
                 except Exception: pass # Handle potential lookup errors

            if not is_center_admin_for_this_center:
                 print(f"User {user.username} with role '{user_role}' attempted to update inventory they don't manage.")
                 raise PermissionDenied("You do not have permission to update this inventory item.")

        # Ensure only quantity is updated (prevent changing center or product type)
        update_data = {}
        if 'quantity' in serializer.validated_data:
             # Ensure quantity is not negative
             if serializer.validated_data['quantity'] < 0:
                  raise DRFValidationError({"quantity": "Quantity cannot be negative."})
             update_data['quantity'] = serializer.validated_data['quantity']

        if not update_data:
             print(f"User {user.username} sent update request for inventory item {inventory_item.id} but included no valid update fields.")
             raise DRFValidationError("No valid fields provided for update (only 'quantity' is allowed).")

        # Perform the update using the filtered data
        serializer.save(**update_data)
        print(f"Inventory item {inventory_item.id} quantity updated by user {user.username}. New quantity: {inventory_item.quantity}")
        # Return the updated data
        # return Response(serializer.data) # DRF RetrieveUpdateAPIView handles returning data


# --- SMS Webhook View Placeholder (Keep existing) ---
# We'll add the real logic in Phase 3

@csrf_exempt # Disable CSRF for webhook, rely on gateway signature validation later
@require_POST # Ensure only POST requests are accepted
def sms_webhook(request):
    # TODO: Implement SMS receiving logic here
    # 1. Validate request comes from Twilio/Gateway (using signature)
    # 2. Parse incoming message (From number, Body content)
    # 3. Determine action (REGISTER, REQUEST, DONATE)
    # 4. Perform action (create user/profile, create request, etc.)
    # 5. Send response back to gateway (TwiML for Twilio) to reply via SMS
    print("SMS Webhook received!") # Placeholder log
    print(f"From: {request.POST.get('From')}")
    print(f"Body: {request.POST.get('Body')}")

    # Example Twilio response (replace with actual logic)
    # from twilio.twiml.messaging_response import MessagingResponse
    # resp = MessagingResponse()
    # resp.message("Thanks for your message! This is the placeholder webhook.")
    # return HttpResponse(str(resp), content_type='text/xml')

    # For other gateways, the response might just be a 200 OK
    return HttpResponse("Webhook received.", status=200)