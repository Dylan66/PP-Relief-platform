# api/views.py

from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied, ValidationError as DRFValidationError
from django.contrib.auth import get_user_model
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.http import HttpResponse
from django.db import models as django_models

# Import the default RegisterView from dj-rest-auth
from dj_rest_auth.registration.views import RegisterView as DjRestAuthRegisterView

from .models import (
    UserProfile,
    Organization,
    DistributionCenter,
    ProductType,
    InventoryItem,
    ProductRequest,
    USER_ROLE_CHOICES
)
from .serializers import (
    ProductTypeSerializer,
    DistributionCenterSerializer,
    InventoryItemSerializer,
    ProductRequestSerializer,
    CustomUserDetailsSerializer,
    OrganizationSerializer,
    # Import your RegisterSerializer
    RegisterSerializer
)

User = get_user_model()

# --- Custom Registration View ---
# Inherit from the default dj-rest-auth RegisterView
class CustomRegisterView(DjRestAuthRegisterView):
    """
    Custom registration view to fix the serializer.save() argument issue
    and potentially add custom logic during registration if needed later.
    """
    # Use your custom serializer configured in settings.py
    # serializer_class = RegisterSerializer # Already set via REST_AUTH['REGISTER_SERIALIZER']

    def perform_create(self, serializer):
        """
        Save the user and potentially update their profile.
        Override dj-rest-auth's default perform_create to call serializer.save() correctly.
        The default RegisterView at dj_rest_auth.registration.views.py calls serializer.save(self.request),
        which causes TypeError because serializer.save() expects validated_data as keyword arg or no args.
        """
        # The serializer.save() method handles creating the User instance based on validated_data.
        # The post_save signal on the User model will then automatically create the UserProfile.
        # If you needed to set fields on the UserProfile based on registration data
        # (e.g., setting initial role or is_donor if allowed during registration),
        # you would do it *after* the user is created here.

        print(">>> CustomRegisterView.perform_create called <<<")
        print("Serializer validated_data:", serializer.validated_data)

        # *** FIX START: Call serializer.save() WITHOUT passing self.request ***
        # This calls the create() method on your RegisterSerializer with validated_data
        user = serializer.save()
        # *** FIX END ***

        print("User created successfully by serializer.save():", user)
        # The post_save signal create_user_profile should fire here automatically.

        # If you collected profile data in the RegistrationForm and wanted to set it
        # immediately after user creation (and profile creation by signal), you could
        # access it via self.request.data and update user.profile here.
        # This requires adding those fields (like role, location, org_name) to the
        # RegistrationForm frontend, passing them to the register function in AuthContext,
        # adding them as write_only fields to the RegisterSerializer, and then
        # accessing them via serializer.validated_data or self.request.data here.
        # For MVP, we set profile role to 'individual' by default via signal.

        return user # Return the created user instance


# --- Public/General Read-Only Views (Keep existing) ---
class ProductTypeListAPIView(generics.ListAPIView):
    """API endpoint that allows Product Types to be viewed by anyone."""
    queryset = ProductType.objects.all()
    serializer_class = ProductTypeSerializer
    permission_classes = [permissions.AllowAny]


class DistributionCenterListAPIView(generics.ListAPIView):
    """API endpoint that allows Distribution Centers to be viewed by anyone."""
    queryset = DistributionCenter.objects.all()
    serializer_class = DistributionCenterSerializer
    permission_classes = [permissions.AllowAny]


# --- Organization Views (Requires Authentication & potentially Admin role) ---
class OrganizationListCreateAPIView(generics.ListCreateAPIView):
    """API endpoint that allows Organizations to be listed and created."""
    queryset = Organization.objects.all()
    serializer_class = OrganizationSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def post(self, request, *args, **kwargs):
        """Override POST to enforce creation permission."""
        # Only System Admins/Staff can create Organizations via this endpoint
        if not (request.user.is_authenticated and (request.user.is_staff or request.user.is_superuser)):
             raise PermissionDenied("You do not have permission to create an organization.")
        return super().post(request, *args, **kwargs)


# --- Product Request Views (Requires Authentication & Role-based Logic) ---
class ProductRequestListCreateAPIView(generics.ListCreateAPIView):
    """API endpoint for authenticated users/organizations to create new requests and view their existing requests."""
    serializer_class = ProductRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Filter requests based on the logged-in user's explicit role."""
        # ... (keep the get_queryset logic from previous versions) ...
        user = self.request.user
        if user.is_staff or user.is_superuser:
            print(f"User {user.username} is staff/superuser, returning all requests.")
            return ProductRequest.objects.all().order_by('-created_at')

        user_role = None
        user_profile = None
        try:
            user_profile = user.profile
            user_role = user_profile.role
            print(f"User {user.username} (Role: {user_role}) is requesting request list.")
        except UserProfile.DoesNotExist:
             print(f"User {user.username} has no profile. Denying request list.")
             raise PermissionDenied("User profile missing.")
        except AttributeError:
             print(f"User {user.username} profile lookup failed (AttributeError). Denying request list.")
             raise PermissionDenied("User profile lookup failed.")

        if user_role == 'organization_admin':
             try:
                 managed_org = user_profile.managed_organization
                 if managed_org:
                      print(f"User {user.username} (Org Admin) returning requests for Org ID {managed_org.id}")
                      return ProductRequest.objects.filter(requesting_organization=managed_org).order_by('-created_at')
                 else:
                      print(f"User {user.username} (Org Admin) has no linked organization. Returning empty request list.")
                      return ProductRequest.objects.none()
             except Exception as e:
                  print(f"Error retrieving Org Admin requests for user {user.username}: {e}")
                  return ProductRequest.objects.none() # Return empty list on lookup error


        elif user_role == 'individual':
             print(f"User {user.username} ('individual') returning requests linked to their user.")
             return ProductRequest.objects.filter(requester_user=user).order_by('-created_at')

        elif user_role == 'center_admin':
             print(f"User {user.username} ('center_admin') does not see requests in this list view. Returning empty list.")
             return ProductRequest.objects.none()

        print(f"User {user.username} with role '{user_role}' is not authorized to list request list. Denying access.")
        raise PermissionDenied("You do not have permission to view requests.")


    def perform_create(self, serializer):
        """Automatically set the requester based on the logged-in user's explicit role."""
        # ... (keep the perform_create logic from previous versions) ...
        user = self.request.user

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

        if user_role == 'organization_admin':
             try:
                 managed_org = user_profile.managed_organization
                 if managed_org is None:
                      print(f"User {user.username} has role 'organization_admin' but no linked organization.")
                      raise DRFValidationError("Your organization admin profile is not linked to an organization.")
                 print(f"Creating Org Request for: {managed_org.name} by user {user.username}")
                 serializer.save(requesting_organization=managed_org)
                 return

             except Organization.DoesNotExist:
                 print(f"User {user.username} has role 'organization_admin' but linked organization does not exist.")
                 raise DRFValidationError("Linked organization not found.")

        elif user_role == 'individual':
             print(f"Creating Individual Web Request by user: {user.username}")
             serializer.save(requester_user=user)
             return

        else:
             print(f"User {user.username} with role '{user_role}' is not authorized to create requests via this endpoint.")
             raise PermissionDenied("You do not have permission to create this type of request.")


class ProductRequestRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    """API endpoint for retrieving, updating, or deleting a specific product request."""
    serializer_class = ProductRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
         # ... (keep the get_queryset logic from previous versions) ...
        user = self.request.user
        if user.is_staff or user.is_superuser:
            return ProductRequest.objects.all()

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
                      print(f"User {user.username} (Org Admin) retrieving specific request for their org or user.")
                      return ProductRequest.objects.filter(
                          django_models.Q(requesting_organization=managed_org) |
                          django_models.Q(requester_user=user)
                      )
                 else:
                      print(f"User {user.username} (Org Admin) with no linked org retrieving specific request linked to their user.")
                      return ProductRequest.objects.filter(requester_user=user)
             except Exception as e:
                  print(f"Error retrieving specific Org Admin request for user {user.username}: {e}")
                  return ProductRequest.objects.filter(requester_user=user)

        elif user_role == 'individual':
             print(f"User {user.username} ('individual') retrieving specific request linked to their user.")
             return ProductRequest.objects.filter(requester_user=user)

        elif user_role == 'center_admin':
             try:
                 managed_center = user_profile.managed_distribution_center
                 if managed_center:
                      print(f"User {user.username} ('center_admin') retrieving specific request assigned to their center.")
                      return ProductRequest.objects.filter(assigned_distribution_center=managed_center)
                 else:
                      print(f"User {user.username} ('center_admin') with no linked center. Denying specific request.")
                      return ProductRequest.objects.none()
             except Exception as e:
                  print(f"Error retrieving specific Center Admin request for user {user.username}: {e}")
                  return ProductRequest.objects.none()

        print(f"User {user.username} with role '{user_role}' is not authorized to retrieve specific requests. Denying access.")
        raise PermissionDenied("You do not have permission to retrieve this request.")


    # TODO: Implement update, partial_update, destroy methods with object-level permissions.


# --- Inventory Views (Keep existing) ---
class InventoryItemListAPIView(generics.ListAPIView):
    """API endpoint to list inventory items."""
    serializer_class = InventoryItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # ... (keep the get_queryset logic from previous versions) ...
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


        if user.is_staff or user.is_superuser or user_role == 'system_admin':
             center_id = self.request.query_params.get('center_id', None)
             if center_id is not None:
                  print(f"Admin/Staff user {user.username} filtering inventory by center_id={center_id}")
                  return queryset.filter(distribution_center_id=center_id).order_by('distribution_center__name', 'product_type__name')
             print(f"Admin/Staff user {user.username} listing all inventory.")
             return queryset.order_by('distribution_center__name', 'product_type__name')

        if user_role == 'center_admin':
            try:
                managed_center = user_profile.managed_distribution_center
                if managed_center:
                     print(f"User {user.username} is Center Admin, filtering inventory for Center ID {managed_center.id}")
                     return queryset.filter(distribution_center=managed_center).order_by('product_type__name')
                else:
                     print(f"User {user.username} has role 'center_admin' but no linked center. Returning empty inventory list.")
                     return InventoryItem.objects.none()
            except Exception as e:
                 print(f"Error retrieving Inventory for user {user.username}: {e}")
                 return InventoryItem.objects.none()


        print(f"User {user.username} with role '{user_role}' is not authorized to list inventory. Denying access.")
        raise PermissionDenied("You do not have permission to view inventory.")


class InventoryItemRetrieveUpdateAPIView(generics.RetrieveUpdateAPIView):
    """API endpoint to retrieve or update the quantity of a specific inventory item."""
    serializer_class = InventoryItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer(self, *args, **kwargs):
        kwargs['partial'] = True
        return super().get_serializer(*args, **kwargs)

    def perform_update(self, serializer):
        # ... (keep the perform_update logic from previous versions) ...
        user = self.request.user
        inventory_item = self.get_object()

        user_role = None
        try: user_profile = user.profile; user_role = user_profile.role
        except UserProfile.DoesNotExist: raise PermissionDenied("User profile missing.")
        except AttributeError: raise PermissionDenied("User profile lookup failed.")

        if not (user.is_staff or user.is_superuser or user_role == 'system_admin'):
            is_center_admin_for_this_center = False
            if user_role == 'center_admin' and instance.assigned_distribution_center:
                 try:
                      managed_center = user_profile.managed_distribution_center
                      if managed_center == inventory_item.distribution_center:
                           is_center_admin_for_this_center = True
                 except Exception: pass

            if not is_center_admin_for_this_center:
                 print(f"User {user.username} with role '{user_role}' attempted to update inventory they don't manage.")
                 raise PermissionDenied("You do not have permission to update this inventory item.")

        update_data = {}
        if 'quantity' in serializer.validated_data:
             if serializer.validated_data['quantity'] < 0:
                  raise DRFValidationError({"quantity": "Quantity cannot be negative."})
             update_data['quantity'] = serializer.validated_data['quantity']

        if not update_data:
             print(f"User {user.username} sent update request for inventory item {inventory_item.id} but included no valid update fields.")
             raise DRFValidationError("No valid fields provided for update (only 'quantity' is allowed).")

        serializer.save(**update_data)
        print(f"Inventory item {inventory_item.id} quantity updated by user {user.username}. New quantity: {inventory_item.quantity}")


# --- SMS Webhook View Placeholder (Keep existing) ---
@csrf_exempt
@require_POST
def sms_webhook(request):
    # ... (keep sms_webhook logic) ...
    print("SMS Webhook received!")
    print(f"From: {request.POST.get('From')}")
    print(f"Body: {request.POST.get('Body')}")
    return HttpResponse("Webhook received.", status=200)