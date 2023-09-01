"""
Functions for the machine learning endpoints.
- detect: Predict the class of the image.
- batch_detect: Predict the class of the images in the batch.
- retrain: Retrain the model with the new data.
"""

import pickle
import os
import numpy as np
from PIL import Image
import cv2

from django.http import HttpResponse, JsonResponse
from django.forms.models import model_to_dict

from database.models import Album, AlbumImage

MODEL = None

def load_pretrained():
    """
    Load the pretrained model, if it exists.
    """
    global MODEL

    if os.path.exists("./machinelearning/model.pkl"):
        with open("./machinelearning/model.pkl", 'rb') as file:
            MODEL = pickle.load(file)

# Endpoint for /detect page
def detect(request):
    """
    Predict the class of the image.
    """
    global MODEL

    if MODEL is None:
        load_pretrained()

    if MODEL is None:
        return HttpResponse("Mahine Learning model not available", status=500)

    if request.method != "POST":
        return HttpResponse("Invalid method invocation", status=400)

    image = request.FILES.get("image")
    if image is None:
        return HttpResponse("Image provided is not valid", status=400)
    try:
      image = Image.open(image)
      image = np.array(image)
    except Exception as e:
      print(e)
      return HttpResponse("Image provided is not valid", status=400)

    # Preprocess the image
    gray_scaled = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    resized = cv2.resize(gray_scaled, (224, 224))
    flattened = resized.flatten()

    # Predict the class
    prediction = MODEL.predict([flattened])[0]
    probability = MODEL.predict_proba([flattened])[0]

    # Retrieve additional details
    try:
        album = Album.objects.get(title=prediction)
        details = model_to_dict(album)
        thumbnail = AlbumImage.objects.filter(album=album).first()
        if thumbnail is not None:
            details["thumbnail"] = thumbnail.image.url
    except:
        details = {}

    return JsonResponse({
        "PredProba": np.max(probability) * 100, # Convert to percentage
        "Title": prediction,
        "Country": details.get("country", "Missing in database"),
        "Class_of_album": details.get("class_of_album", "Missing in database"),
        "Weapons": details.get("weapons", "Missing in database"),
        "Thumbnail": details.get("thumbnail", "Missing in database")
    }, status=200)

# Endpoint for /batch page
def batch_detect(request):
    """
    Predict the class of the images in the batch.
    """
    return HttpResponse("Not implemented", status=501)

# Endpoint for /retrain page
def retrain(request):
    """
    Retrain the model with the new data.
    """
    return HttpResponse("Not implemented", status=501)
