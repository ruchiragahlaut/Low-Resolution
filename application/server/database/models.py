from typing import Any, Dict, Tuple
from django.db import models
import uuid
import os

class Album(models.Model):
    """
    Database model for a collection of images
    """
    title = models.CharField(max_length=70)
    country = models.CharField(max_length=70)
    class_of_album = models.CharField(max_length=70)
    weapons = models.CharField(max_length=70, blank=True)

    def __str__(self):
        return self.title

class AlbumImage(models.Model):
    """
    Database model for an image in an album
    """
    def image_upload_path(self, filename):
        """
        Save image to media/album_id/image_id.jpg
        """
        return f'{self.album.title}/{uuid.uuid4()}.jpg'

    def delete(self, *args, **kwargs):
        """
        Delete image from filesystem when image is deleted from database
        """
        os.remove(self.image.path)
        super().delete(*args, **kwargs)

    image = models.ImageField(upload_to=image_upload_path)
    album = models.ForeignKey(Album, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.album.title} - {self.id}"
