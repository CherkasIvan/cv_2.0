@echo off
setlocal enabledelayedexpansion

:: Создаем папку для бекапов если её нет
if not exist "database\backups" mkdir "database\backups"

:: Генерируем имя файла с датой
for /f "tokens=1-3 delims=/" %%a in ('date /t') do (
    set _day=%%a
    set _month=%%b
    set _year=%%c
)
for /f "tokens=1-2 delims=:" %%a in ('time /t') do (
    set _hour=%%a
    set _minute=%%b
)

set timestamp=!_year!!_month!!_day!_!_hour!!_minute!
set backup_file=database\backups\backup_%timestamp%.sql

echo Creating production database backup: %backup_file%
docker exec -i postgres_prod pg_dump -U jv13 -d cv_db_prod > %backup_file%

:: Создаем симлинк latest_backup.sql
if exist "database\backups\latest_backup.sql" del "database\backups\latest_backup.sql"
copy %backup_file% "database\backups\latest_backup.sql" > nul

echo Backup completed: %backup_file%
echo Latest backup link updated
pause