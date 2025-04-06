"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
# backend/urls.py (Edit this existing file)

from django.contrib import admin
from django.urls import path, include # Add include

urlpatterns = [
    path('admin/', admin.site.urls),

    # Include the URLs from the 'api' app under the '/api/' prefix
    path('api/', include('api.urls')), # Add this line
     # Add dj-rest-auth URLs for login, logout, password reset, etc.
    path('api/auth/', include('dj_rest_auth.urls')),

    # Add dj-rest-auth registration URLs (provides /api/auth/registration/)
    path('api/auth/registration/', include('dj_rest_auth.registration.urls')),

    # URLs for django-allauth if needed (e.g., for email confirmation pages)
    path('accounts/', include('allauth.urls')),

    # TODO: Add URLs for DRF's browsable API login/logout if needed for testing
    # path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
]
