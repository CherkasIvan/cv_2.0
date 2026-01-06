// src/migration/ReplacePersonNameWithFullNameFields.ts
import { MigrationInterface, QueryRunner } from 'typeorm';

export class ReplacePersonNameWithFullNameFields1711231234568 implements MigrationInterface {
    name = 'ReplacePersonNameWithFullNameFields1711231234568';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Добавляем новые поля
        await queryRunner.query(`
            ALTER TABLE "persons" 
            ADD COLUMN IF NOT EXISTS "firstName" text,
            ADD COLUMN IF NOT EXISTS "lastName" text,
            ADD COLUMN IF NOT EXISTS "middleName" text;
        `);

        // Переносим данные из поля name в новые поля
        // Предполагаем, что name содержит полное имя в формате "Фамилия Имя Отчество"
        await queryRunner.query(`
            UPDATE "persons" 
            SET 
                "firstName" = SPLIT_PART(TRIM("name"), ' ', 2), -- Второе слово как имя
                "lastName" = SPLIT_PART(TRIM("name"), ' ', 1), -- Первое слово как фамилия  
                "middleName" = SPLIT_PART(TRIM("name"), ' ', 3) -- Третье слово как отчество
            WHERE "name" IS NOT NULL AND "name" != '';
        `);

        // Если name пустой, но есть email, можно использовать часть email как имя
        await queryRunner.query(`
            UPDATE "persons" 
            SET 
                "firstName" = SPLIT_PART("loginEmail", '@', 1)
            WHERE ("firstName" IS NULL OR "firstName" = '') 
            AND "loginEmail" IS NOT NULL AND "loginEmail" != '';
        `);

        // Переименовываем поле name в name_backup для сохранения данных
        await queryRunner.query(`
            ALTER TABLE "persons" 
            RENAME COLUMN "name" TO "name_backup";
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Восстанавливаем поле name из новых полей
        await queryRunner.query(`
            ALTER TABLE "persons" 
            ADD COLUMN IF NOT EXISTS "name" text;
        `);

        // Объединяем данные из новых полей обратно в name
        await queryRunner.query(`
            UPDATE "persons" 
            SET "name" = TRIM(
                CONCAT_WS(' ',
                    NULLIF("lastName", ''),
                    NULLIF("firstName", ''),
                    NULLIF("middleName", '')
                )
            )
            WHERE "lastName" IS NOT NULL OR "firstName" IS NOT NULL OR "middleName" IS NOT NULL;
        `);

        // Удаляем временные поля
        await queryRunner.query(`
            ALTER TABLE "persons" 
            DROP COLUMN IF EXISTS "firstName",
            DROP COLUMN IF EXISTS "lastName", 
            DROP COLUMN IF EXISTS "middleName";
        `);

        // Если переименовывали поле, возвращаем оригинальное имя
        await queryRunner.query(`
            ALTER TABLE "persons" 
            RENAME COLUMN "name_backup" TO "name";
        `);
    }
}
