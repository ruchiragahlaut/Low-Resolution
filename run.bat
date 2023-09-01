cd application/server

@REM # Setup virtual environment
CALL venv\Scripts\activate

@REM # Run server
python manage.py runserver
