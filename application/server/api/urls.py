# App level URL

from django.urls import path
from database.views import DataViewSet

urlpatterns = [
  path('data/', DataViewSet.as_view({'get': 'list'})),
  path('data/<int:pk>/', DataViewSet.as_view({'get': 'retrieve'})),
  path('data/<int:pk>/update/', DataViewSet.as_view({'put': 'update'})),
  path('data/<int:pk>/delete/', DataViewSet.as_view({'delete': 'destroy'})),
  path('data/create/', DataViewSet.as_view({'post': 'create'})),
]
