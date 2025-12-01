@echo off
echo Restoring database from backup...

if not exist "database\backups\latest_backup.sql" (
    echo Error: latest_backup.sql not found!
    echo Please run backup-prod.bat first or specify backup file.
    pause
    exit /b 1
)

echo WARNING: This will overwrite production database!
echo Press Ctrl+C to cancel or any key to continue...
pause > nul

echo Restoring production database...
docker exec -i postgres_prod psql -U jv13 -d cv_db_prod < database\backups\latest_backup.sql

echo Restore completed!
pause