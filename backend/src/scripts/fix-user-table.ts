// scripts/fix-user-table.ts
import { config } from 'dotenv';
import * as path from 'path';
import { DataSource } from 'typeorm';

// Загружаем environment variables
const envPath = path.resolve(process.cwd(), '..', '.env.development');
config({ path: envPath });

async function fixUserTable() {
    console.log('Starting database fix...');

    const dataSource = new DataSource({
        type: 'postgres',
        host: process.env.POSTGRES_HOST || 'localhost',
        port: parseInt(process.env.POSTGRES_PORT || '5432'),
        username: process.env.POSTGRES_USER || 'postgres',
        password: process.env.POSTGRES_PASSWORD || 'password',
        database: process.env.POSTGRES_DB || 'cv_db_dev',
        synchronize: false,
        logging: true,
    });

    try {
        await dataSource.initialize();
        console.log('✅ Database connected successfully');

        // Удаляем старые колонки, если они существуют
        console.log('🗑️  Removing old columns...');

        const dropColumnsQueries = [
            `ALTER TABLE "users" DROP COLUMN IF EXISTS "firstName"`,
            `ALTER TABLE "users" DROP COLUMN IF EXISTS "lastName"`,
            `ALTER TABLE "users" DROP COLUMN IF EXISTS "middleName"`,
        ];

        for (const query of dropColumnsQueries) {
            try {
                await dataSource.query(query);
                console.log(`✅ Executed: ${query}`);
            } catch (error) {
                console.log(
                    `ℹ️  Column already removed or doesn't exist: ${error.message}`,
                );
            }
        }

        // Добавляем правильные колонки
        console.log('✨ Adding new columns...');

        const addColumnsQueries = [
            `ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "displayName" character varying`,
            `ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP DEFAULT NOW()`,
            `ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP DEFAULT NOW()`,
        ];

        for (const query of addColumnsQueries) {
            try {
                await dataSource.query(query);
                console.log(`✅ Executed: ${query}`);
            } catch (error) {
                console.log(`ℹ️  Column already exists: ${error.message}`);
            }
        }

        // Обновляем существующие данные
        console.log('🔄 Updating existing data...');
        try {
            await dataSource.query(
                `UPDATE "users" SET "displayName" = '' WHERE "displayName" IS NULL`,
            );
            console.log('✅ Data updated successfully');
        } catch (error) {
            console.log(`ℹ️  Data update: ${error.message}`);
        }

        // Проверяем структуру таблицы
        console.log('🔍 Checking table structure...');
        const tableStructure = await dataSource.query(`
            SELECT column_name, data_type, is_nullable 
            FROM information_schema.columns 
            WHERE table_name = 'users' 
            ORDER BY ordinal_position
        `);

        console.log('📊 Current users table structure:');
        tableStructure.forEach((column: any) => {
            console.log(
                `   - ${column.column_name} (${column.data_type}) ${column.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'}`,
            );
        });

        console.log('🎉 Database fix completed successfully!');
    } catch (error) {
        console.error('❌ Error fixing database:', error);
        process.exit(1);
    } finally {
        if (dataSource.isInitialized) {
            await dataSource.destroy();
            console.log('🔌 Database connection closed');
        }
    }
}

// Запускаем скрипт
fixUserTable().catch(console.error);
