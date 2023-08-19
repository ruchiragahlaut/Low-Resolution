from .models import Data
from rest_framework import viewsets, serializers

class DataSerializer(serializers.ModelSerializer):
  class Meta:
    model = Data
    fields = ['id', 'name_of_object', 'country', 'class_of_object']
  
class DataViewSet(viewsets.ModelViewSet):
  queryset = Data.objects.all()
  serializer_class = DataSerializer
