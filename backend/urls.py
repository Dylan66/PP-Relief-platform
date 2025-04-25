# backend/urls.py

from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),

    # Include your app's API urls under 
    # the '/api/' prefix
    path('api/', include('api.urls')),
    # Include dj-rest-auth URLs for login, logout, password reset, etc.
    # Provides endpoints like /api/auth/login/, /api/auth/logout/, /api/auth/password/reset/
    path('api/auth/', include('dj_rest_auth.urls')),

    # Include dj-rest-auth registration URLs
    # Provides endpoint like /api/auth/registration/
    path('api/auth/registration/', include('dj_rest_auth.registration.urls')),

    # Optional: Include URLs for django-allauth if needed (e.g., for email confirmation pages)
    # path('accounts/', include('allauth.urls')),

    # Optional: URLs for DRF's browsable API login/logout (useful for testing)
    # path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
]