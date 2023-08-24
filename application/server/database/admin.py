from django.contrib import admin

# Register your models here.
from .models import Album, AlbumImage

admin.site.register(Album)
admin.site.register(AlbumImage)
