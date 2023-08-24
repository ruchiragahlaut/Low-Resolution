from rest_framework import viewsets, serializers, permissions
from django.db.models import Prefetch
from .models import Album, AlbumImage

class AlbumImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = AlbumImage
        fields = ['id', 'image', 'album']

class AlbumSerializer(serializers.ModelSerializer):
    images = AlbumImageSerializer(many=True, read_only=True)

    class Meta:
        model = Album
        fields = ['id', 'title', 'country', 'class_of_album', 'images']

class AlbumViewSet(viewsets.ModelViewSet):
    queryset = Album.objects.prefetch_related(Prefetch('albumimage_set', queryset=AlbumImage.objects.all(), to_attr='images'))
    serializer_class = AlbumSerializer
    permission_classes = [permissions.IsAuthenticated]

class AlbumImageViewSet(viewsets.ModelViewSet):
    queryset = AlbumImage.objects.all()
    serializer_class = AlbumImageSerializer
    permission_classes = [permissions.IsAuthenticated]
