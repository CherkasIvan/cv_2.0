@echo off
echo Starting database synchronization...

:: Создаем дамп из продакшен БД
echo Creating backup from production database...
docker exec -i postgres_prod pg_dump -U jv13 -d cv_db_prod > database\backups\prod_backup.sql

:: Очищаем дев БД и восстанавливаем из бекапа
echo Cleaning development database...
docker exec -i postgres_dev psql -U jv13 -d cv_db_dev -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"

echo Restoring to development database...
docker exec -i postgres_dev psql -U jv13 -d cv_db_dev < database\backups\prod_backup.sql

echo Database synchronization completed!
echo.
echo Production: postgres_prod:5432 (cv_db_prod)
echo Development: postgres_dev:5433 (cv_db_dev)
pause