from django.db import models

# Create your models here.
class Data(models.Model):
  id = models.AutoField(primary_key=True)
  name_of_object = models.CharField(max_length=100)
  country = models.CharField(max_length=100)
  class_of_object = models.CharField(max_length=100)

  def __str__(self):
    return self.name_of_object
