import cv2
import numpy as np
# import matplotlib.pyplot as plt
from datetime import datetime
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import ExtraTreesClassifier, VotingClassifier
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import pickle
import os
img = []
classes = []

for i in os.listdir('Data'):
    for j in os.listdir('Data/'+i):
        temp = cv2.imread('Data/'+i+'/'+j)
        #convert to gray scale
        temp = cv2.cvtColor(temp, cv2.COLOR_BGR2GRAY) 
        # apply digital filter
        # temp = applyLaplacian(laplacianMask, temp)
        temp = cv2.resize(temp, (224,224))
        # flatten the image
        temp = temp.flatten()
        img.append(temp)
        classes.append(i)

img_laplacian = np.array(img)
classes = np.array(classes)


xtrain, xtest, ytrain, ytest = train_test_split(img_laplacian, classes, test_size=0.3, random_state=0, stratify=classes)
model = ExtraTreesClassifier(n_estimators=100, random_state=0)

y_pred = model.fit(xtrain, ytrain).predict(xtest)
accuracy = accuracy_score(ytest, y_pred)
report = classification_report(ytest, y_pred)
matrix = confusion_matrix(ytest, y_pred)
# Save model to file
filename = f'model_{accuracy:.2f}_{datetime.now().strftime("%Y-%m-%d_%H-%M-%S")}.pkl'
with open(filename, 'wb') as f:
  pickle.dump(model, f)
# Write log file
with open('log.txt', 'a') as f:
  f.write(f'{filename}\nAccuracy: {accuracy:.2f}\nClassification Report:\n{report}\nConfusion Matrix:\n{matrix}\n\n')
