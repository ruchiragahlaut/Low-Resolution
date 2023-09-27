This script, _**grid-search.py**_, loads a set of images from a directory, preprocesses them, and trains a voting classifier model using the preprocessed images. The trained model is then saved to a file using pickle.

The script performs the following steps:

1. Imports the necessary libraries: models, cv2, numpy, os, and pickle.
2. Loads a set of images from a directory using cv2.imread().
3. Preprocesses the images by converting them to grayscale and resizing them to (224, 224) using cv2.cvtColor() and cv2.resize().
4. Creates a numpy array of the preprocessed images and their corresponding labels.
5. Trains a voting classifier model using the preprocessed images and their labels with models.model_selector().
6. Saves the trained model to a file using pickle.dump().

The script assumes that the images are stored in a directory named 'Data' in the 'model-backend' directory. The images should be organized into subdirectories, with each subdirectory representing a different class of images.

The script outputs the shape of the preprocessed image array to the console.

To use the trained model, you can load it from the saved file using pickle.load(). You can then use the predict() method of the model to make predictions on new images.

Note that this script does not perform hyperparameter tuning or cross-validation. It simply trains a voting classifier model using the preprocessed images and their labels. If you want to perform hyperparameter tuning or cross-validation, you will need to modify the script accordingly.

This script, _**models.py**_, trains a voting classifier model to classify images based on their content. The script applies different image filters to the images, preprocesses them, and trains multiple models using the preprocessed images. The top 5 models based on accuracy are then combined into a voting classifier model, which is saved to a file using pickle.

The script performs the following steps:

1. Defines a set of image filters, including Laplacian and Sobel filters.
2. Defines a function to train a model on preprocessed image data and evaluate its accuracy.
3. Defines a function to apply a Laplacian filter to an image.
4. Defines a function to apply a Sobel filter to an image.
5. Defines a function to select the best models based on accuracy and combine them into a voting classifier model.
6. Defines a function to predict the class of a new image using the trained model.

The script assumes that the images are stored in a directory named 'Data' in the 'model-backend' directory. The images should be organized into subdirectories, with each subdirectory representing a different class of images.

To train the model, you can call the model_selector() function with the preprocessed image data and labels. The function applies different image filters to the images, preprocesses them, and trains multiple models using the preprocessed images. The top 5 models based on accuracy are then combined into a voting classifier model, which is saved to a file using pickle. The function returns the trained model.

To predict the class of a new image, you can call the predict_image_class() function with the image and the trained model. The function applies different image filters to the image, preprocesses them, and predicts the class of the image using the trained model. The function returns the predicted class.

Note that this script does not perform hyperparameter tuning or cross-validation. It simply trains a voting classifier model using the preprocessed images and their labels. If you want to perform hyperparameter tuning or cross-validation, you will need to modify the script accordingly.

_**test.py**_
This script loads a set of images from a directory, preprocesses them, and trains an ExtraTreesClassifier model using the preprocessed images. The trained model is then saved to a file using pickle, and a log file is written with the model's accuracy, classification report, and confusion matrix.

The script performs the following steps:

Loads a set of images from a directory using `cv2.imread()`.

Preprocesses the images by converting them to grayscale, resizing them to (224, 224), and flattening them.
Splits the preprocessed images and their corresponding labels into training and testing sets using `train_test_split()`.

Trains an ExtraTreesClassifier model using the preprocessed images and their labels with n_estimators=100 and random_state=0.
Predicts the labels of the test set using the trained model.

Calculates the accuracy, classification report, and confusion matrix of the model's predictions.
Saves the trained model to a file using `pickle.dump()`.
Writes a log file with the filename of the saved model, its accuracy, classification report, and confusion matrix.

_The script assumes that the images are stored in a directory named 'Data' in the 'model-backend' directory. The images should be organized into subdirectories, with each subdirectory representing a different class of images._

The script outputs the accuracy, classification report, and confusion matrix of the trained model to the console.

To use the trained model, you can load it from the saved file using `pickle.load()`. You can then use the `predict()` method of the model to make predictions on new images.


Here's an explanation of the purpose of each file in the `model-backend` folder:

- `model-encoder.h5`: This file contains a trained autoencoder model that can be used to compress and decompress images. The purpose of this model is to reduce the dimensionality of the image data and remove noise from the images.

- `model.pkl`: This file contains a trained machine learning model that can be used to classify images based on their content. The purpose of this model is to predict the class of a new image based on its features.

- `requirements.txt`: This file contains a list of Python packages that are required to run the scripts in the `model-backend` folder. You can install these packages using `pip install -r requirements.txt`.

- `research1_autoEncoders.ipynb`: This is a Jupyter notebook that contains code for training and evaluating autoencoder models. The purpose of this notebook is to experiment with different autoencoder architectures and hyperparameters to find the best model for the image compression task.

- `model_0.89_2023-08-31_09-20-03.pkl`: This file contains a trained machine learning model that can be used to classify images based on their content. The purpose of this model is to predict the class of a new image based on its features. The filename contains the accuracy of the model and the date and time it was trained.

- `logs.txt`: This file contains a log of the trained machine learning models, including their filenames, accuracy, classification report, and confusion matrix. The purpose of this file is to keep track of the performance of the trained models.

- `voting_classifier.pkl`: This file contains a trained machine learning model that can be used to classify images based on their content. The purpose of this model is to predict the class of a new image based on the predictions of multiple other models. The voting classifier combines the predictions of the other models to make a final prediction.
