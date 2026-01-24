@echo off
echo ============================================
echo URL Shortener - Full Stack Developer Setup
echo ============================================
echo.

REM Check if MongoDB is running
echo Checking MongoDB...
tasklist /FI "ImageName eq mongod.exe" 2>NUL | find /I /N "mongod.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo ✓ MongoDB is running
) else (
    echo ✗ MongoDB not running. Please start MongoDB first:
    echo   mongod
    pause
    exit /b 1
)

echo.
echo Starting backend server...
start /d "%~dp0" cmd /k "npm run dev"

echo Waiting 3 seconds before starting frontend...
timeout /t 3 /nobreak

echo.
echo Starting React frontend...
start /d "%~dp0client" cmd /k "npm start"

echo.
echo ✓ Backend running on http://localhost:3000
echo ✓ Frontend starting at http://localhost:3000
echo ✓ Open http://localhost:3000 in your browser
echo.
pause
