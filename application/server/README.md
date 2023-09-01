# Low-resolution image classification

## Setup instructions

> Requires python, pip, virtualenv

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
npm i && npm run build
cd ../../server
```

### Create superuser

```bash
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
```

### Run server

```bash
python manage.py runserver
```
