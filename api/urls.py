# api/urls.py

from django.urls import path
from . import views # Import views from the current directory (api app)

# Define URL patterns for the api app
urlpatterns = [
    path('csrf/', views.csrf_cookie_view, name='csrf_cookie'),
    # Public endpoints
    path('product-types/', views.ProductTypeListAPIView.as_view(), name='product-type-list'),
    path('distribution-centers/', views.DistributionCenterListAPIView.as_view(), name='distribution-center-list'),

    # Organization endpoints
    path('organizations/', views.OrganizationListCreateAPIView.as_view(), name='organization-list-create'),
    # Add retrieve/update/delete for Organization later if needed:
    # path('organizations/<int:pk>/', views.OrganizationRetrieveUpdateDestroyAPIView.as_view(), name='organization-detail'),

    # Product Request endpoints
    path('product-requests/', views.ProductRequestListCreateAPIView.as_view(), name='product-request-list-create'),
    path('product-requests/<int:pk>/', views.ProductRequestRetrieveUpdateDestroyAPIView.as_view(), name='product-request-detail'),

    # Inventory endpoints
    path('inventory/', views.InventoryItemListAPIView.as_view(), name='inventory-item-list'),
    path('inventory/<int:pk>/', views.InventoryItemRetrieveUpdateAPIView.as_view(), name='inventory-item-detail'),

    # SMS Webhook endpoint
    path('sms/webhook/', views.sms_webhook, name='sms-webhook'),

    # TODO: Add Authentication endpoints (Login, Logout, Register User) later using DRF or dj-rest-auth/djoser
    # >>> REMOVE THIS LINE <<<
    # path('auth/user/', views.CurrentUserAPIView.as_view(), name='current-user'),
    # >>> REMOVE THIS LINE <<<

    # Authentication URLs are handled by including 'dj_rest_auth.urls' and 'dj_rest_auth.registration.urls'
    # in your project's main backend/urls.py file.
]