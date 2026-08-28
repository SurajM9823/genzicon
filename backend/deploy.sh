# Build frontend static files
npm run build

# Navigate to Django backend directory
cd backend

# Setup Python environment
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Run migrations & seed data
python manage.py makemigrations api
python manage.py migrate
python manage.py seed_data

# Collect static files for production
python manage.py collectstatic --noinput

# Run server with Gunicorn (Production)
gunicorn genzicon_core.wsgi:application --bind 0.0.0.0:8000
