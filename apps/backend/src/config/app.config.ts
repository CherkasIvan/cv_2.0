import * as path from 'path';

// Используем __dirname для правильного определения пути
const rootPath = path.resolve(__dirname, '../../../..');

// Функция для определения порта базы данных
const getDatabasePort = (): number => {
    if (process.env.NODE_ENV === 'production' || process.env.DOCKER_CONTAINER) {
        return 5432; // В Docker - внутренний порт контейнера
    }
    return 5433; // Локально - маппинг из Docker
};

// Функция для определения хоста базы данных
const getDatabaseHost = (): string => {
    if (process.env.NODE_ENV === 'production' || process.env.DOCKER_CONTAINER) {
        return 'postgres'; // В Docker - имя сервиса
    }
    return 'localhost'; // Локально - localhost
};

export default () => ({
    // Настройки приложения
    app: {
        port: parseInt(process.env.PORT, 10) || 3000,
        environment: process.env.NODE_ENV || 'development',
        autoMigrate: process.env.AUTO_MIGRATE === 'true',
        dockerContainer: process.env.DOCKER_CONTAINER === 'true',
    },

    // Настройки базы данных
    database: {
        host: getDatabaseHost(),
        port: getDatabasePort(),
        username: process.env.POSTGRES_USER || 'jv13',
        password: process.env.POSTGRES_PASSWORD || 'postgres',
        database: process.env.POSTGRES_DB || 'cv_db',
    },

    // Настройки Firebase
    firebase: {
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        databaseURL: process.env.FIREBASE_DATABASE_URL,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.FIREBASE_APP_ID,
        measurementId: process.env.FIREBASE_MEASUREMENT_ID,

        // Admin SDK
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    },

    // Другие настройки
    github: {
        accessToken: process.env.GITHUB_PRIVATE_ACCESS_TOKEN,
    },

    // Пути
    paths: {
        root: rootPath,
        backend: path.resolve(rootPath, 'backend'),
        frontend: path.resolve(rootPath, 'frontend'),
    },
});