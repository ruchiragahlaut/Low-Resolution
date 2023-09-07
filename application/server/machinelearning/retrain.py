# Written by: Devasy Patel and Deep Patel

import cv2
import numpy as np
from datetime import datetime
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import ExtraTreesClassifier, VotingClassifier
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import pickle
import os


masks = {
    'laplacian1': np.array([[0, 1, 0], [1, -4, 1], [0, 1, 0]]),
    'laplacian2': np.array([[1, 1, 1], [1, -8, 1], [1, 1, 1]]),
    'laplacian3': np.array([[2, -1, 2], [-1, -4, -1], [2, -1, 2]]),
    'laplacian4': np.array([[-1, 2, -1], [2, -4, 2], [-1, 2, -1]]),
    'laplacian5': np.array([[0, -1, 0], [-1, 4, -1], [0, -1, 0]]),
    'laplacian6': np.array([[-1, -1, -1], [-1, 8, -1], [-1, -1, -1]]),
    'soebel1': np.array([[1, 0, -1], [2, 0, -2], [1, 0, -1]]),
    'soebel2': np.array([[1, 2, 1], [0, 0, 0], [-1, -2, -1]]),
}


def train_model( X, y, model):
        # Split data into training and testing sets
        X_train, X_test, y_train, y_test = train_test_split(list(X), y, test_size=0.3, random_state=0, stratify=y)
        # Preprocess training data
        
        # Train model on preprocessed data
        model.fit(X_train, y_train)
        # Preprocess testing data
        
        # Evaluate model on testing data
        y_pred = model.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)
        report = classification_report(y_test, y_pred)
        matrix = confusion_matrix(y_test, y_pred)
        return accuracy, report, matrix


from functools import partial

def applyLaplacian(mask, img):
    # Apply laplacian filter to the image
    filteredImg = cv2.filter2D(img, -1, mask)
    
    # Add the filtered image to the original image to enhance the boundary information
    finalImg = np.uint8(np.clip(img + filteredImg, 0, 255))
    return finalImg
    
def applySobel(mask, img):
    if mask == 'soebel1':
        s1 = cv2.Sobel(img,cv2.CV_64F,1,0,ksize=5)
    elif mask == 'soebel2':
        s1 = cv2.Sobel(img,cv2.CV_64F,0,1,ksize=5)
    # s2 = cv2.Sobel(img,cv2.CV_64F,0,1,ksize=5)
    return s1

def model_selector(X, y):
    # Create multiple models
    accuracies = []
    models = []
    for mask_type in masks:
        if mask_type in ['laplacian1', 'laplacian2', 'laplacian3', 'laplacian4', 'laplacian5', 'laplacian6']:
            mask = masks[mask_type]
            applyFilter = partial(applyLaplacian, mask)
        elif mask_type in ['soebel1', 'soebel2']:
            applyFilter = partial(applySobel, mask_type)
        else:
            continue
        print("Calculating for ", mask_type)
        yield f"Calculating for {mask_type}"
        
        for model_type in ['extra_trees', 'svm']:
            if model_type == 'extra_trees':
                model = ExtraTreesClassifier(n_estimators=100, random_state=0)
                X_filtered = (applyFilter(img) for img in X)
                X_resized = (cv2.resize(img, (128, 128)) for img in X_filtered)
                X_scaled = (img.flatten() for img in X_resized)
                # X_scaled = StandardScaler().fit_transform(X_processed)
                accuracy, report, matrix = train_model(X_scaled, y, model)
                print(f"Model {mask_type} {model_type} trained and gave accuracy {accuracy}")
                yield f"Model {mask_type} {model_type} trained and gave accuracy {accuracy}"

                accuracies.append(accuracy)
                models.append(model)
            elif model_type == 'svm':
                model = SVC(kernel='linear', C=1.0, random_state=0, probability=True)
                X_filtered = (applyFilter(img) for img in X)
                X_resized = (cv2.resize(img, (128, 128)) for img in X_filtered)
                X_scaled = (img.flatten() for img in X_resized)
                # X_scaled = StandardScaler().fit_transform(X_processed)
                accuracy, report, matrix = train_model(X_scaled, y, model)
                print(f"Model {mask_type} {model_type} trained and gave accuracy {accuracy}")
                yield f"Model {mask_type} {model_type} trained and gave accuracy {accuracy}"

                accuracies.append(accuracy)
                models.append(model)
            elif model_type == 'xgb':
                model = XGBClassifier(random_state=0)
                X_filtered = (applyFilter(img) for img in X)
                X_resized = (cv2.resize(img, (128, 128)) for img in X_filtered)
                X_scaled = (img.flatten() for img in X_resized)
                # X_scaled = StandardScaler().fit_transform(X_processed)
                accuracy, report, matrix = train_model(X_scaled, y, model)
                print(f"Model {mask_type} {model_type} trained and gave accuracy {accuracy}")
                yield f"Model {mask_type} {model_type} trained and gave accuracy {accuracy}"

                accuracies.append(accuracy)
                models.append(model)
            

    # Choose top 5 models based on accuracy
    print("Choosing top 5 models based on accuracy")
    yield "Choosing top 5 models based on accuracy"

    # top_models = [model for _, model in sorted(zip(accuracies, models), reverse=True)[:5]]
    top_models = [model for model, acc in sorted(zip(models, accuracies), key=lambda x: x[1], reverse=True)][:5]
    print(top_models)
    yield str(top_models)

    # Soft voting for probability
    voting_clf = VotingClassifier([(str(i), model) for i, model in enumerate(top_models)], voting='soft')

    X_resized = (cv2.resize(img, (128, 128)) for img in X)
    X_scaled = (img.flatten() for img in X_resized)


    accuracy, report, matrix = train_model(X_scaled, y, voting_clf)
    # Save model to file
    filename = f'backup/model_{accuracy:.2f}_{datetime.now().strftime("%Y-%m-%d")}.pkl'
    with open(filename, 'wb') as f:
        pickle.dump(voting_clf, f)
    # Write log file
    with open('backup/log.txt', 'a') as f:
        f.write(f'{filename}\nAccuracy: {accuracy:.2f}\nClassification Report:\n{report}\nConfusion Matrix:\n{matrix}\n\n')
    return voting_clf



def predict_image_class(img, model):
    # Preprocess image
    img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    img = cv2.resize(img, (128, 128))
    X=[img]
    for mask_type in masks:
        if mask_type in ['laplacian1', 'laplacian2', 'laplacian3', 'laplacian4', 'laplacian5', 'laplacian6']:
            mask = masks[mask_type]
            X.append(applyLaplacian(mask, img))
        elif mask_type in ['soebel1', 'soebel2']:
            X.append(applySobel(mask_type, img))
        else:
            continue
    X = [img.flatten() for img in X]
    X = np.array(X)
    # Predict class
    pred = model.predict(X)
    # use the mode of the predictions
    pred = np.bincount(pred).argmax()
    return pred

def retrain_helper():
    # Load the image
    X = []
    y    = []

    PATH = 'media/' # Path relative to manage.py

    for idx, imgclass in enumerate(os.listdir(PATH)):
        for img in os.listdir(PATH+imgclass):
            img = cv2.imread(PATH+imgclass+'/'+img)
            img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY) 
            img = cv2.resize(img, (224,224))
            X.append(img)
            y.append(int(imgclass))
    X = np.array(X)
    y = np.array(y)

    print(X.shape, y.shape)

    generator = model_selector(X, y)
    try:
      while True:
        yield next(generator) + "<br />"
    except StopIteration as e:
        vclf = e.value
        # Dump the model, path relative to manage.py
        pickle.dump(vclf, open('machinelearning/model.pkl', 'wb'))
