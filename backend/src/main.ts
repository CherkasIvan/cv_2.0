import * as dotenv from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { resolve } from 'path';

dotenv.config({ path: resolve(__dirname, '../../.env') });

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    
    // Глобальная валидация
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));

    // Настройка Swagger
    const config = new DocumentBuilder()
        .setTitle('CV Portfolio Backend API')
        .setDescription('Комprehensive API для управления портфолио разработчика с миграцией данных из Firebase в PostgreSQL')
        .setVersion('1.0')
        .addTag('auth', 'Аутентификация и управление сессиями')
        .addTag('migration', 'Миграция данных между Firebase и PostgreSQL')
        .addTag('firebase', 'Прямой доступ к данным Firebase')
        .addTag('data', 'Доступ к данным из PostgreSQL')
        .addBearerAuth()
        .setContact('Developer', 'https://portfolio.example.com', 'dev@example.com')
        .setLicense('MIT', 'https://opensource.org/licenses/MIT')
        .build();
    
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document, {
        customSiteTitle: 'CV Portfolio API Documentation',
        swaggerOptions: {
            persistAuthorization: true,
            tagsSorter: 'alpha',
            operationsSorter: 'alpha',
            docExpansion: 'none',
            filter: true,
            showRequestDuration: true,
        },
        customCss: `
            .swagger-ui .topbar { display: none }
            .swagger-ui .info { margin: 20px 0 }
        `,
    });

    // CORS настройка
    app.enableCors({
        origin: [
            'http://localhost:4200',
            'http://localhost:4000',
            'http://localhost:3000',
            'https://cv2-0963057afb5c.herokuapp.com',
        ],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    });
    
    await app.listen(3000);
    
    console.log(`🚀 Приложение запущено на http://localhost:3000`);
    console.log(`📚 Swagger документация доступна на http://localhost:3000/api`);
}

bootstrap();