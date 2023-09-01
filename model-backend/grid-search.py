import models
import cv2
import numpy as np
import os
import pickle
# Load the image
X = []
y  = []
PATH = 'model-backend/Data/'
for idx, imgclass in enumerate(os.listdir(PATH)):
    for img in os.listdir(PATH+imgclass):
        img = cv2.imread(PATH+imgclass+'/'+img)
        img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY) 
        img = cv2.resize(img, (224,224))
        X.append(img)
        y.append(idx)
X = np.array(X)
y = np.array(y)
print(X.shape, y.shape)
vclf = models.model_selector(X, y)
# Dump the model
# pickle.dump(vclf, open('voting_classifier.pkl', 'wb'))
