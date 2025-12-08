@echo off
chcp 65001 > nul
echo ========================================
echo       Stopping CV Application
echo ========================================

echo Stopping containers...
docker-compose down

echo Removing unused volumes...
docker volume prune -f

echo.
echo ========================================
echo    Application stopped successfully!
echo ========================================

pause