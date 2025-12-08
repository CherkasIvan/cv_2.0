@echo off
echo Switching backend to use PRODUCTION database...

:: Останавливаем backend
docker stop backend_cv

:: Запускаем backend с продакшен БД
docker run -d --rm ^
  --name backend_cv_prod ^
  --network cv-network ^
  -p 3000:3000 ^
  -e NODE_ENV=production ^
  -e DOCKER_CONTAINER=true ^
  -e POSTGRES_HOST=postgres_prod ^
  -e POSTGRES_PORT=5432 ^
  -e POSTGRES_DB=cv_db_prod ^
  -e POSTGRES_USER=jv13 ^
  -e POSTGRES_PASSWORD=postgres ^
  your-backend-image:latest

echo Backend now using PRODUCTION database
echo Old backend container stopped, new container: backend_cv_prod
pause