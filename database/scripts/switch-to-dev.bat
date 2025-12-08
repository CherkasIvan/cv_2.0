@echo off
echo Switching backend to use DEVELOPMENT database...

:: Останавливаем продакшен backend
docker stop backend_cv_prod

:: Запускаем backend с дев БД (из docker-compose)
docker-compose up -d backend

echo Backend now using DEVELOPMENT database
pause