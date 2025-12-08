@echo off
chcp 65001 > nul
echo ========================================
echo       Container Status
echo ========================================

echo.
echo Docker Containers:
docker ps -a --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo.
echo Docker Images:
docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}"

echo.
echo Docker Volumes:
docker volume ls

pause