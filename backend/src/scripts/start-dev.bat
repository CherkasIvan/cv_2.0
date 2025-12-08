@echo off
chcp 65001 > nul
echo ========================================
echo    Starting CV Application - DEVELOPMENT
echo ========================================

REM Загружаем переменные из .env.development
for /f "usebackq delims=" %%i in (".env.development") do set %%i

echo Environment: %NODE_ENV%
echo Database: %POSTGRES_DB%
echo.

echo Building and starting development containers...
docker-compose -f docker-compose.dev.yml up --build

if %errorlevel% neq 0 (
    echo.
    echo ========================================
    echo    Error starting development environment!
    echo ========================================
    echo Check Docker is running and try again.
)

pause