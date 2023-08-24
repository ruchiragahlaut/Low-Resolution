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

class AlbumImage(models.Model):
    """
    Database model for an image in an album
    """
    def image_upload_path(self, filename = None):
        """
        Save image to media/album_id/image_id.jpg
        """
        if filename is None:
            filename = uuid.uuid4()
        return f'{self.album.id}/{filename}.jpg'

    def save(self, *args, **kwargs):
        """
        Rename temporary uuid to image id
        """
        super().save(*args, **kwargs)
        self.image.path = self.image_upload_path(self.id)
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        """
        Delete image from filesystem when image is deleted from database
        """
        self.image.delete()
        super().delete(*args, **kwargs)

    image = models.ImageField(upload_to=image_upload_path)
    album = models.ForeignKey(Album, on_delete=models.CASCADE)
