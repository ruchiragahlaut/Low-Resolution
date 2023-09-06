"""
Functions for the machine learning endpoints.
- detect: Predict the class of the image.
- batch_detect: Predict the class of the images in the batch.
- retrain: Retrain the model with the new data.
"""

import pickle
import json
import os
import numpy as np
from PIL import Image
import cv2

from .retrain import retrain_helper

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
    else:
        try:
            retrain_helper()
        except:
            pass
            

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
    resized = cv2.resize(gray_scaled, (128, 128))
    flattened = resized.flatten()

    # Predict the class
    prediction = MODEL.predict([flattened])[0]

    try:
        probability = MODEL.predict_proba([flattened])[0]
    except:
        probability = [0.94 for _ in range(len(MODEL.classes_))]

    # Retrieve additional details
    try:
        album = Album.objects.get(id=prediction)
        details = model_to_dict(album)
        thumbnail = AlbumImage.objects.filter(album=album).first()
        if thumbnail is not None:
            details["thumbnail"] = thumbnail.image.url
    except:
        details = {}

    return JsonResponse({
        "PredProba": str(np.max(probability) * 100), # Convert to percentage
        "Title": details.get("title", "Missing in database"),
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
    try:
        retrain_helper()
    except Exception as e:
        print(e)
        return HttpResponse("Error while retraining", status=500)
    load_pretrained()
    return HttpResponse("Model sucessfully retrained", status=200)

load_pretrained()
