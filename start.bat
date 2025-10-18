@echo off
echo 🚀 Starting Trump Letter Generator...
echo.

REM Check if Python virtual environment exists
if not exist "backend\venv" (
    echo ❌ Python virtual environment not found!
    echo Please run setup first:
    echo   cd backend
    echo   python -m venv venv
    echo   venv\Scripts\activate
    echo   pip install -r requirements.txt
    exit /b 1
)

REM Start backend
echo 🐍 Starting Python backend (port 8000)...
cd backend
call venv\Scripts\activate
start /B python main.py
cd ..

REM Wait a bit for backend to start
timeout /t 3 /nobreak >nul

REM Start frontend
echo ⚛️  Starting Next.js frontend (port 3000)...
start /B npm run dev

echo.
echo ✅ Both servers started!
echo    Backend:  http://localhost:8000
echo    Frontend: http://localhost:3000
echo.
echo Press Ctrl+C to stop
pause

