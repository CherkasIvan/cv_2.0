import * as path from 'path';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const getDatabaseConfig = (): TypeOrmModuleOptions => {
    const isProduction = process.env.NODE_ENV === 'production';
    const isDocker = process.env.DOCKER_CONTAINER === 'true';

    const baseConfig: TypeOrmModuleOptions = {
        type: 'postgres',
        host: process.env.POSTGRES_HOST || 'postgres_dev',
        port: parseInt(process.env.POSTGRES_PORT) || 5432,
        username: process.env.POSTGRES_USER || 'jv13',
        password: process.env.POSTGRES_PASSWORD || 'postgres',
        database: process.env.POSTGRES_DB || 'cv_db_dev',
        entities: [path.join(__dirname, '../**/!(*auth-session|*user).entity{.ts,.js}')],
        synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true', 
        logging: process.env.NODE_ENV === 'development',
        migrations: [path.join(__dirname, '../migrations/*{.ts,.js}')],
        migrationsRun: process.env.TYPEORM_MIGRATIONS_RUN === 'true',
        migrationsTableName: 'migrations',
        extra: {},
    };

    if (isProduction) {
        return {
            ...baseConfig,
            synchronize: true, 
            logging: false,
            extra: {
                ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
            },
        };
    }

    return baseConfig;
};