@echo off
chcp 65001 > nul
echo ========================================
echo       Restarting CV Application
echo ========================================

echo Stopping existing containers...
docker-compose down

echo Cleaning up...
docker system prune -f

echo Starting fresh...
call start.bat