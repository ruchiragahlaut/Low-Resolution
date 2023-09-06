[![Grid Search Workflow](https://github.com/Devasy23/Low-Resolution/actions/workflows/grid-search.yml/badge.svg?branch=main)](https://github.com/Devasy23/Low-Resolution/actions/workflows/grid-search.yml)# Low-resolution image classification


## Project structure

```
(root)
|-- README.md: project instructions
|
|-- application: contains the application code for server and sites
|   |-- frontend: contains the frontend code for the client/admin site
|   |   |-- client: contains the frontend code for the client site (react)
|   |   \-- admin: contains the frontend code for the admin site (react)
|   |
|   \-- server: contains the backend code for the server (django)
|       |-- djangoserver: contains the django project
|       |-- database: contains django app for database model
|       \-- api: contains django app for api endpoints
|
|-- Data
|   |-- cargo
|   |-- Container
|   |-- Fishing vessel
|   |-- fishing vessels or small ships
|   |-- Island.zip
|   \-- Tanker.zip
|
|-- model-backend
|   |-- model
|   |   |-- cnn.py
|   |   |-- common.py
|   |   |-- edsr.py
|   |   |-- prep_model.py
|   |   |-- srgan.py
|   |   |-- utils.py
|   |   \-- __init__.py
|   |
|   |-- model.pkl
|   |-- research1-ensemble.ipynb
|   |-- research1.ipynb
|   \-- research2.ipynb
|
```

## Installation instructions

See `aaplication/server/README.md` for installation instructions.
