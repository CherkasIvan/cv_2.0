@echo off
chcp 65001 > nul
echo ========================================
echo    Starting CV Application - PRODUCTION
echo ========================================

echo Checking for .env file...
if not exist ".env" (
    echo ERROR: .env file not found!
    echo Please create .env file in the project root.
    pause
    exit /b 1
)

echo Building and starting containers...
docker-compose up --build -d

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo    Application started successfully!
    echo ========================================
    echo Frontend: http://localhost:80
    echo Backend API: http://localhost:3000
    echo Swagger: http://localhost:3000/api
    echo PgAdmin: http://localhost:8082
    echo.
    echo Check containers: docker ps
    echo View logs: docker-compose logs -f
) else (
    echo.
    echo ========================================
    echo    Error starting application!
    echo ========================================
    echo Check Docker is running and try again.
)

pause