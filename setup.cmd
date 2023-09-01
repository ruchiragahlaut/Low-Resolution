@REM # Build static files
cd ./application/frontend/client
CALL npm ci && CALL npm run build

cd ../../server

@REM # Setup virtual environment
python -m virtualenv venv
CALL venv\Scripts\activate

@REM # Install dependencies
pip install -r requirements.txt

@REM # Create superuser
python manage.py makemigrations
python manage.py migrate

SET DJANGO_SUPERUSER_USERNAME=admin
SET DJANGO_SUPERUSER_PASSWORD=admin
SET DJANGO_SUPERUSER_EMAIL=admin@example.com
python manage.py createsuperuser --no-input --skip-checks
