@echo off
echo ====================================
echo    WheatVision AI Project Setup
echo ====================================
echo.

:: Check if Python is installed
python --version > nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Python is not installed!
    echo Please install Python from https://www.python.org/downloads/
    echo Make sure to check "Add to PATH" during installation
    pause
    exit /b 1
)

:: Check if Node.js is installed
node --version > nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

:: Install Python requirements
echo Installing Python dependencies...
cd backend
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo Error installing Python dependencies!
    pause
    exit /b 1
)
cd ..

:: Install Node.js dependencies
echo.
echo Installing Node.js dependencies...
call npm install
if %errorlevel% neq 0 (
    echo Error installing Node.js dependencies!
    pause
    exit /b 1
)

echo.
echo ====================================
echo       Starting WheatVision AI
echo ====================================
echo.

:: Start the backend server
echo Starting Backend Server...
start cmd /k "cd backend && python -m uvicorn app:app --reload"

:: Wait for backend to initialize
timeout /t 3 /nobreak > nul

:: Start the frontend
echo Starting Frontend Server...
start cmd /k "npm run dev"

echo.
echo ====================================
echo       Setup Complete!
echo ====================================
echo.
echo Backend server: http://localhost:8000
echo Frontend will open automatically in your browser
echo.
echo To stop the application, close both command windows that opened.
echo.
pause
