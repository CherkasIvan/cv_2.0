import * as dotenv from 'dotenv';
import * as path from 'path';
import { DataSource } from 'typeorm';

// Правильный путь к .env файлу
const envFilePath = path.resolve(__dirname, '../../../../.env');
dotenv.config({ path: envFilePath });

const backendPath = path.resolve(__dirname, '..');

// Функция для определения хоста
const getDatabaseHost = (): string => {
    if (process.env.NODE_ENV === 'production' || process.env.DOCKER_CONTAINER) {
        return 'postgres';
    }
    return 'localhost';
};

// Функция для определения пользователя
const getDatabaseUsername = (): string => {
    if (
        process.env.NODE_ENV === 'development' &&
        !process.env.DOCKER_CONTAINER
    ) {
        return process.env.POSTGRES_USER || 'postgres';
    }
    return process.env.POSTGRES_USER || 'jv13';
};

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: getDatabaseHost(),
    port: parseInt(process.env.POSTGRES_PORT) || 5432,
    username: getDatabaseUsername(),
    password: process.env.POSTGRES_PASSWORD || 'postgres',
    database: process.env.POSTGRES_DB || 'cv_db',
    entities: [path.join(backendPath, 'src/**/*.entity{.ts,.js}')],
    migrations: [path.join(backendPath, 'src/modules/migration/*{.ts,.js}')],
    synchronize: false,
    logging: true,
});