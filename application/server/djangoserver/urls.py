"""
URL configuration for djangoserver project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
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
from django.urls import path, include
from django.contrib import admin
from django.contrib.sessions.models import Session

from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import HttpResponseRedirect, HttpResponse
from django.conf import settings

# Redirect ROOT_URL to the client site
CLIENT_SITE_URL = settings.STATIC_URL + "client/index.html"
def index(request):
    """
    Redirect request at ROOT_URL to the client site by default.
    """
    return HttpResponseRedirect(CLIENT_SITE_URL)

@ensure_csrf_cookie
def new_session(request):
    """
    Create new session for client.
    """
    return HttpResponse(status=200)

def validate_session(request):
    """
    Validate session so that only HTTP requests with valid sessionid
    can access the API endpoints.
    """
    sessionid = request.COOKIES.get("sessionid")
    if sessionid is None:
        return HttpResponse(status=401)
    try:
        session = Session.objects.get(session_key=sessionid)
    except Session.DoesNotExist:
        return HttpResponse(status=401)
    return HttpResponse(status=201)

urlpatterns = [
    path(r'', index),

    # API Endpoints
    path(r'api/auth/session/', include('rest_framework.urls')),
    path(r'api/auth/session/new/', new_session),
    path(r'api/auth/session/validate/', validate_session),

    # Django Administration
    path(r'admin/', admin.site.urls),
]
