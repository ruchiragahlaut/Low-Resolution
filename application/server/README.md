# Low-resolution image classification

## Project structure

```
(application/server)
|-- README.md: project instructions
|-- manage.py: django project manager
|-- requirements.txt: python dependencies
|-- .gitignore: files to ignore in git
|
|-- djangoserver: contains the django project
|   |-- settings.py: django project settings
|   |-- urls.py: django project urls
|   |-- wsgi.py: django project web server gateway interface
|   \-- asgi.py: django project asynchronous server gateway interface
|
|-- database: contains django app for database model
|   |-- models.py: database model
|   |-- admin.py: django admin site configuration
|   |-- apps.py: django app configuration
|   |-- tests.py: django app tests
|   |-- views.py: django app views
|   \-- migrations: database migrations (auto-generated)
|
\-- api: contains django app for api endpoints
    |-- models.py: database model
    |-- admin.py: django admin site configuration
    |-- apps.py: django app configuration
    |-- tests.py: django app tests
    |-- views.py: django app views
    |-- urls.py: django app urls
    \-- migrations: database migrations (auto-generated)
```

## Temporary files
```
(application/server)
|-- db.sqlite3: database file (ignored in git)
|-- venv: python virtual environment (ignored in git)
|
\-- static: client and admin sites static files (ignored in git)
    |-- client: client site static files (ignored in git)
    \-- admin: admin site static files (ignored in git)
```

## Setup instructions

> Requires python

### Setup virtual environment

```bash
python -m pip install virtualenv
python -m virtualenv venv
```

### Activate virtual environment

```bash
# Linux
source venv/bin/activate

# Windows
venv\Scripts\activate
```

### Install dependencies

```bash
pip install -r requirements.txt
```

### Build client site

See `../frontend/client/README.md`

```bash
cd ../frontend/client

# Install dependencies
npm install

# Build client site
npm run build
```

### Run server

```bash
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```

## URL endpoints

| URL | Info |
| --- | ---- |
| http://localhost:8000 | Base URL |
| http://localhost:8000/ | Redirects to client site |
| http://localhost:8000/admin | Django administration site (not used) |
| http://localhost:8000/site | Frontend client/admin site |
| http://localhost:8000/site/client/index.html | Frontend client site (managed by djangoserver.urls) |
| http://localhost:8000/site/admin/index.html | Frontend admin site (not implemented) |
| http://localhost:8000/api | API endpoints |
| http://localhost:8000/api/data | API endpoints for interacting with database |
| http://localhost:8000/api/data/ | List all data entries |
| http://localhost:8000/api/data/create | Create new data entry |
| http://localhost:8000/api/data/\<id> | Get data entry with id \<id> |
| http://localhost:8000/api/data/\<id>/update | Update data entry with id \<id> |
| http://localhost:8000/api/data/\<id>/delete | Delete data entry with id \<id> |
| http://localhost:8000/api/images | API endpoints for interacting with images (not implemented) |

## Database model

| Field | Type | Info |
| ----- | ---- | ---- |
| id | int | Primary key |
| name_of_object | string | Name of data entry |
| country | string | Country of data entry |
| class_of_object | string | Class of data entry |

### CRUD operations

| Operation | URL | Info |
| --------- | --- | ---- |
| List | http://localhost:8000/api/data/ | List all data entries |
| Create | http://localhost:8000/api/data/create | Create new data entry |
| Read | http://localhost:8000/api/data/\<id> | Get data entry with id \<id> |
| Update | http://localhost:8000/api/data/\<id>/update | Update data entry with id \<id> |
| Delete | http://localhost:8000/api/data/\<id>/delete | Delete data entry with id \<id> |

## Image model

For storing images (not implemented)
