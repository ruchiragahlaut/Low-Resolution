# Build static files
cd ./application/frontend/client
npm ci && npm run build

cd ../../server

# Setup virtual environment
python -m pip install virtualenv
python -m virtualenv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create superuser
python manage.py makemigrations
python manage.py migrate

DJANGO_SUPERUSER_USERNAME=admin \
DJANGO_SUPERUSER_PASSWORD=admin \
DJANGO_SUPERUSER_EMAIL="admin@example.com" \
python manage.py createsuperuser --no-input --skip-checks
