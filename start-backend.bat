@echo off
echo ========================================
echo   Silvermoon Resort - Backend Server
echo ========================================
echo.

cd backend

if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
    echo.
)

echo Activating virtual environment...
call venv\Scripts\activate

if not exist db.sqlite3 (
    echo.
    echo First time setup detected!
    echo Installing dependencies...
    pip install -r requirements.txt
    echo.
    echo Running migrations...
    python manage.py makemigrations
    python manage.py migrate
    echo.
    echo Please create a superuser:
    python manage.py createsuperuser
    echo.
)

echo.
echo Starting Django server...
echo Backend will be available at: http://127.0.0.1:8000/
echo Admin panel at: http://127.0.0.1:8000/admin/
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

python manage.py runserver
