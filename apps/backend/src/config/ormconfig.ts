// src/config/ormconfig.ts
import { config } from 'dotenv';
import * as path from 'path';
import { DataSource } from 'typeorm';

// Загружаем env файлы из корня проекта
config({ path: path.resolve(process.cwd(), '..', '.env.development') });
config({ path: path.resolve(process.cwd(), '..', '.env.production') });
config({ path: path.resolve(process.cwd(), '..', '.env') });

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT) || 5432,
    username: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'password',
    database: process.env.POSTGRES_DB || 'cv_db_dev',
    entities: [path.join(__dirname, '../shared/entities/*.entity.{js,ts}')],
    migrations: [path.join(__dirname, '../migration/*.{js,ts}')],
    synchronize: process.env.NODE_ENV === 'development',
    logging: process.env.NODE_ENV === 'development',
});
