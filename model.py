import os
import cv2
import numpy as np
from datetime import datetime
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import ExtraTreesClassifier, VotingClassifier
from sklearn.svm import SVC
from xgboost import XGBClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import pickle



class Mask:
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
  
  def __init__(self, mask_type='laplacian1', mask_size=3):
    self.mask_type = mask_type
    self.mask_size = mask_size
    self.mask = self.masks[mask_type]
    return None
  
  def applyLaplacian(self, laplacianMask, img):
    # Apply laplacian filter to the image
    filteredImg = cv2.filter2D(img, -1, laplacianMask)
    
    # Add the filtered image to the original image to enhance the boundary information
    finalImg = np.uint8(np.clip(img + filteredImg, 0, 255))
    return finalImg
  
  def createMask(self, matrix):
    # Create a mask of size 3x3
    mask = np.ones((self.mask_size, self.mask_size), dtype=np.float32)
    
    # Normalize the mask
    mask = mask / (self.mask_size * self.mask_size)
    return mask
  
  def storeMask(self, mask):
    # Store all the masks in a pickle file
    with open('mask.pkl', 'wb') as f:
      pickle.dump(mask, f)
  
  def loadMask(self):
    # Load the mask from the pickle file
    with open('mask.pkl', 'rb') as f:
      mask = pickle.load(f)
    return mask
  
   

class ImageClassifier(Mask):
    def __init__(self, model_type='extra_trees',  mask_type='laplacian', mask_size=3):
        self.scaler = StandardScaler()
        self.mask_type = mask_type
        self.mask_size = mask_size
        if model_type == 'extra_trees':
            self.model = ExtraTreesClassifier(n_estimators=100, random_state=0)
        elif model_type == 'svm':
            self.model = SVC(kernel='linear', C=1.0, random_state=0)
        elif model_type == 'xgb':
            self.model = XGBClassifier(random_state=0)
        else:
            raise ValueError('Invalid model type')

    def preprocess_images(self, X):
        # Convert images to grayscale
        X = [cv2.cvtColor(img, cv2.COLOR_BGR2GRAY) for img in X]
        # Apply Laplacian filter
        X = [cv2.Laplacian(img, cv2.CV_64F) for img in X]
        # Resize images to 224x224
        X = [cv2.resize(img, (224, 224)) for img in X]
        # Flatten images
        X = [img.flatten() for img in X]
        # Scale pixel values to have zero mean and unit variance
        X = self.scaler.fit_transform(X)
        return X
    def applyLaplacian(self, laplacianMask, img):
      # Apply laplacian filter to the image
      filteredImg = cv2.filter2D(img, -1, laplacianMask)
      
      # Add the filtered image to the original image to enhance the boundary information
      finalImg = np.uint8(np.clip(img + filteredImg, 0, 255))
      return finalImg
      
    def train_model(self, X, y):
        # Split data into training and testing sets
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=0, stratify=y)
        # Preprocess training data
        X_train = self.preprocess_images(X_train)
        # Train model on preprocessed data
        self.model.fit(X_train, y_train)
        # Preprocess testing data
        X_test = self.preprocess_images(X_test)
        # Evaluate model on testing data
        y_pred = self.model.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)
        report = classification_report(y_test, y_pred)
        matrix = confusion_matrix(y_test, y_pred)
        return accuracy, report, matrix


def model_selector(X, y):
  # Create multiple models
  models = []
  for model_type in ['extra_trees', 'svm', 'xgb']:
    for mask_type in Mask.masks.keys():
      for mask_size in [3, 5]:
        models.append(ImageClassifier(model_type=model_type, mask_type=mask_type, mask_size=mask_size))
  # Train models on data
  accuracies = []
  for model in models:
    accuracy, _, _ = model.train_model(X, y)
    accuracies.append(accuracy)
  # Choose top 5 models based on accuracy
  top_models = [models[i] for i in np.argsort(accuracies)[-5:]]
  # Combine models using voting classifier
  voting_clf = VotingClassifier([(str(i), model.model) for i, model in enumerate(top_models)], voting='hard')
  voting_clf.fit(X, y)
  # Evaluate ensemble model on testing data
  y_pred = voting_clf.predict(X)
  accuracy = accuracy_score(y, y_pred)
  report = classification_report(y, y_pred)
  matrix = confusion_matrix(y, y_pred)
  # Save model to file
  filename = f'model_{accuracy:.2f}_{datetime.now().strftime("%Y-%m-%d_%H-%M-%S")}.pkl'
  with open(filename, 'wb') as f:
    pickle.dump(voting_clf, f)
  # Write log file
  with open('log.txt', 'a') as f:
    f.write(f'{filename}\nAccuracy: {accuracy:.2f}\nClassification Report:\n{report}\nConfusion Matrix:\n{matrix}\n\n')
  return voting_clf





'''Extra Code
# Path: model.py


# import os
# import cv2
# import numpy as np
# from datetime import datetime
# from sklearn.model_selection import train_test_split
# from sklearn.preprocessing import StandardScaler
# from sklearn.ensemble import ExtraTreesClassifier, VotingClassifier
# from sklearn.svm import SVC
# from xgboost import XGBClassifier
# from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
# import pickle

# class Mask:
#   masks = {
#     'laplacian1': np.array([[0, 1, 0], [1, -4, 1], [0, 1, 0]]),
#     'laplacian2': np.array([[1, 1, 1], [1, -8, 1], [1, 1, 1]]),
#     'laplacian3': np.array([[2, -1, 2], [-1, -4, -1], [2, -1, 2]]),
#     'laplacian4': np.array([[-1, 2, -1], [2, -4, 2], [-1, 2, -1]]),
#     'laplacian5': np.array([[0, -1, 0], [-1, 4, -1], [0, -1, 0]]),
#     'laplacian6': np.array([[-1, -1, -1], [-1, 8, -1], [-1, -1, -1]]),
    
#     'soebel1': np.array([[1, 0, -1], [2, 0, -2], [1, 0, -1]]),
#     'soebel2': np.array([[1, 2, 1], [0, 0, 0], [-1, -2, -1]]),
#   }
  
#   def __init__(self, mask_type='laplacian1', mask_size=3):
#     self.mask = self.createMask(self.masks[mask_type], mask_size)
  
#   def applyLaplacian(self, laplacianMask, img):
#     # Apply laplacian filter to the image
#     filteredImg = cv2.filter2D(img, -1, laplacianMask)
    
#     # Add the filtered image to the original image to enhance the boundary information
#     finalImg = np.uint8(np.clip(img + filteredImg, 0, 255))
#     return finalImg
  
#   def createMask(self, matrix, size):
#     # Create a mask of size 3x3
#     return np.kron(matrix, np.ones((size, size)))

class ImageClassifier(Mask):
  def __init__(self, model_type='extra_trees', mask_type='laplacian1', mask_size=3):
    super().__init__(mask_type, mask_size)
    self.scaler = StandardScaler()
    self.mask_type = mask_type
    self.mask_size = mask_size
    if model_type == 'extra_trees':
      self.model = ExtraTreesClassifier(n_estimators=100, random_state=0)
    elif model_type == 'svm':
      self.model = SVC(kernel='linear', C=1.0, random_state=0)
    elif model_type == 'xgb':
      self.model = XGBClassifier(random_state=0)
    else:
      raise ValueError('Invalid model type')

  def preprocess_images(self, X):
    # Convert images to grayscale
    X = [cv2.cvtColor(img, cv2.COLOR_BGR2GRAY) for img in X]
    # Apply Laplacian filter
    X = [self.applyLaplacian(self.mask, img) for img in X]
    # Resize images to 224x224
    X = [cv2.resize(img, (224, 224)) for img in X]
    # Flatten images
    X = [img.flatten() for img in X]
    # Scale pixel values to have zero mean and unit variance
    X = self.scaler.fit_transform(X)
    return X

  def train_model(self, X, y):
    # Split data into training and testing sets
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=0, stratify=y)
    # Preprocess training data
    X_train = self.preprocess_images(X_train)
    # Train model on preprocessed data
    self.model.fit(X_train, y_train)
    # Preprocess testing data
    X_test = self.preprocess_images(X_test)
    # Evaluate model on testing data
    y_pred = self.model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    report = classification_report(y_test, y_pred)
    matrix = confusion_matrix(y_test, y_pred)
    return accuracy, report, matrix
'''
