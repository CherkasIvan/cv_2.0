@echo off
echo Fixing by creating missing records in technologies_aside...

echo Step 1: Finding missing technology_aside IDs...
docker exec -i postgres_dev psql -U jv13 -d cv_db_dev -c "
SELECT DISTINCT hsn.technology_aside_id 
FROM hard_skills_nav hsn 
LEFT JOIN technologies_aside ta ON hsn.technology_aside_id = ta.id 
WHERE ta.id IS NULL;" > missing_ids.txt

echo Step 2: Creating missing records...
docker exec -i postgres_dev psql -U jv13 -d cv_db_dev -c "
INSERT INTO technologies_aside (id, title, description, \"createdAt\", \"updatedAt\")
SELECT 
    hsn.technology_aside_id,
    'Auto-created Technology ' || hsn.technology_aside_id,
    'Automatically created to fix foreign key constraint',
    NOW(),
    NOW()
FROM hard_skills_nav hsn 
LEFT JOIN technologies_aside ta ON hsn.technology_aside_id = ta.id 
WHERE ta.id IS NULL
GROUP BY hsn.technology_aside_id;"

echo Step 3: Verifying fix...
docker exec -i postgres_dev psql -U jv13 -d cv_db_dev -c "
SELECT COUNT(*) as remaining_problems 
FROM hard_skills_nav hsn 
LEFT JOIN technologies_aside ta ON hsn.technology_aside_id = ta.id 
WHERE ta.id IS NULL;"

echo Missing records created successfully!
pause