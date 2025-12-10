@echo off
chcp 65001 > nul
echo ========================================
echo       Application Logs
echo ========================================

echo Press Ctrl+C to exit logs view
docker-compose logs -f

pause