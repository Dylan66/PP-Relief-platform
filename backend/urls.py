# backend/urls.py

from django.contrib import admin
from django.urls import path, include

# Import your custom registration view
from api.views import CustomRegisterView # <-- IMPORT YOUR CUSTOM VIEW

urlpatterns = [
    path('admin/', admin.site.urls),

    # Include your app's API urls under the '/api/' prefix
    path('api/', include('api.urls')),

    # Include dj-rest-auth URLs for login, logout, password reset, etc.
    # These are fine as they are, they don't call the problematic serializer.save(self.request)
    # like the default registration view does.
    path('api/auth/', include('dj_rest_auth.urls')),

    # *** REPLACE the default dj-rest-auth registration URL include ***
    # path('api/auth/registration/', include('dj_rest_auth.registration.urls')), # <-- COMMENT OUT or REMOVE this line

    # *** Add the path for your CUSTOM registration view ***
    path('api/auth/registration/', CustomRegisterView.as_view(), name='rest_register'), # <-- ADD this line
    # Use the standard name 'rest_register' often used by allauth/dj-rest-auth

    # Optional: Include URLs for django-allauth if needed
    # path('accounts/', include('allauth.urls')),

    # Optional: URLs for DRF's browsable API login/logout
    # path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
]