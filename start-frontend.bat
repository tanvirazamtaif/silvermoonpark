@echo off
echo ========================================
echo   Silvermoon Resort - Frontend App
echo ========================================
echo.

cd frontend

if not exist node_modules (
    echo Installing dependencies...
    npm install
    echo.
)

echo Starting Vite development server...
echo Frontend will be available at: http://localhost:5173/
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

npm run dev
