@echo off
echo Fixing foreign key constraint issue...

echo Step 1: Checking problematic records in hard_skills_nav...
docker exec -i postgres_dev psql -U jv13 -d cv_db_dev -c "SELECT DISTINCT technology_aside_id FROM hard_skills_nav WHERE technology_aside_id NOT IN (SELECT id FROM technologies_aside);"

echo Step 2: Checking available IDs in technologies_aside...
docker exec -i postgres_dev psql -U jv13 -d cv_db_dev -c "SELECT id FROM technologies_aside ORDER BY id;"

echo Step 3: Removing problematic records from hard_skills_nav...
docker exec -i postgres_dev psql -U jv13 -d cv_db_dev -c "DELETE FROM hard_skills_nav WHERE technology_aside_id NOT IN (SELECT id FROM technologies_aside);"

echo Step 4: Verifying fix...
docker exec -i postgres_dev psql -U jv13 -d cv_db_dev -c "SELECT COUNT(*) as problematic_records FROM hard_skills_nav WHERE technology_aside_id NOT IN (SELECT id FROM technologies_aside);"

echo Foreign key issue should be fixed now!
pause