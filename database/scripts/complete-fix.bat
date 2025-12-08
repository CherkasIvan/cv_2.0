@echo off
echo Complete foreign key constraint fix...

echo Step 1: Backup current data...
docker exec -i postgres_dev pg_dump -U jv13 -d cv_db_dev -t hard_skills_nav > hard_skills_nav_backup.sql

echo Step 2: Drop the problematic foreign key constraint...
docker exec -i postgres_dev psql -U jv13 -d cv_db_dev -c "ALTER TABLE hard_skills_nav DROP CONSTRAINT IF EXISTS FK_b4a05e849a9dba9023051746643;"

echo Step 3: Clean up orphaned records...
docker exec -i postgres_dev psql -U jv13 -d cv_db_dev -c "DELETE FROM hard_skills_nav WHERE technology_aside_id NOT IN (SELECT id FROM technologies_aside);"

echo Step 4: Recreate the foreign key constraint...
docker exec -i postgres_dev psql -U jv13 -d cv_db_dev -c "ALTER TABLE hard_skills_nav ADD CONSTRAINT FK_b4a05e849a9dba9023051746643 FOREIGN KEY (technology_aside_id) REFERENCES technologies_aside(id) ON DELETE NO ACTION ON UPDATE NO ACTION;"

echo Step 5: Verify the constraint...
docker exec -i postgres_dev psql -U jv13 -d cv_db_dev -c "\d hard_skills_nav"

echo Foreign key constraint fixed successfully!
pause