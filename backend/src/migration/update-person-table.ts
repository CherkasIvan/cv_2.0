// src/migration/UpdatePersonTable.ts
import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdatePersonTable1711231234567 implements MigrationInterface {
    name = 'UpdatePersonTable1711231234567';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Добавляем новые поля
        await queryRunner.query(`
            ALTER TABLE "persons" 
            ADD COLUMN IF NOT EXISTS "positions" text[] DEFAULT '{}',
            ADD COLUMN IF NOT EXISTS "emails" text[] DEFAULT '{}',
            ADD COLUMN IF NOT EXISTS "phones" text[] DEFAULT '{}',
            ADD COLUMN IF NOT EXISTS "locations" text[] DEFAULT '{}',
            ADD COLUMN IF NOT EXISTS "loginEmail" text,
            ADD COLUMN IF NOT EXISTS "isActive" boolean DEFAULT true,
            ADD COLUMN IF NOT EXISTS "resetPasswordToken" text,
            ADD COLUMN IF NOT EXISTS "resetPasswordExpires" timestamp,
            ADD COLUMN IF NOT EXISTS "lastLoginAt" timestamp,
            ADD COLUMN IF NOT EXISTS "failedLoginAttempts" integer DEFAULT 0,
            ADD COLUMN IF NOT EXISTS "isLocked" boolean DEFAULT false,
            ADD COLUMN IF NOT EXISTS "lockedUntil" timestamp,
            ADD COLUMN IF NOT EXISTS "roles" text[] DEFAULT '{"user"}',
            ADD COLUMN IF NOT EXISTS "createdAt" timestamp DEFAULT now(),
            ADD COLUMN IF NOT EXISTS "updatedAt" timestamp DEFAULT now();
        `);

        // Переносим данные из старых полей в новые массивы
        await queryRunner.query(`
            UPDATE "persons" 
            SET 
                "positions" = CASE 
                    WHEN "position" IS NOT NULL THEN ARRAY["position"] 
                    ELSE '{}' 
                END,
                "emails" = CASE 
                    WHEN "email" IS NOT NULL THEN ARRAY["email"] 
                    ELSE '{}' 
                END,
                "phones" = CASE 
                    WHEN "phone" IS NOT NULL THEN ARRAY["phone"] 
                    ELSE '{}' 
                END,
                "locations" = CASE 
                    WHEN "location" IS NOT NULL THEN ARRAY["location"] 
                    ELSE '{}' 
                END,
                "loginEmail" = "email"
        `);

        // Создаем индекс для loginEmail
        await queryRunner.query(`
            CREATE UNIQUE INDEX IF NOT EXISTS "IDX_persons_loginEmail" 
            ON "persons" ("loginEmail") 
            WHERE "loginEmail" IS NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Удаляем индекс
        await queryRunner.query(
            `DROP INDEX IF EXISTS "IDX_persons_loginEmail"`,
        );

        // Удаляем новые поля
        await queryRunner.query(`
            ALTER TABLE "persons" 
            DROP COLUMN IF EXISTS "positions",
            DROP COLUMN IF EXISTS "emails",
            DROP COLUMN IF EXISTS "phones",
            DROP COLUMN IF EXISTS "locations",
            DROP COLUMN IF EXISTS "loginEmail",
            DROP COLUMN IF EXISTS "isActive",
            DROP COLUMN IF EXISTS "resetPasswordToken",
            DROP COLUMN IF EXISTS "resetPasswordExpires",
            DROP COLUMN IF EXISTS "lastLoginAt",
            DROP COLUMN IF EXISTS "failedLoginAttempts",
            DROP COLUMN IF EXISTS "isLocked",
            DROP COLUMN IF EXISTS "lockedUntil",
            DROP COLUMN IF EXISTS "roles",
            DROP COLUMN IF EXISTS "createdAt",
            DROP COLUMN IF EXISTS "updatedAt";
        `);
    }
}
