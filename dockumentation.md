# Docker Документация проекта CV_2.0

## Архитектура контейнеризации

Проект использует многофайловую конфигурацию Docker Compose для разделения сред:

docker-compose.yml # Базовая конфигурация (общие сервисы)
docker-compose.dev.yml # Конфигурация для разработки docker-compose.prod.yml #
Конфигурация для продакшена

## 🚀 Быстрый старт

### Разработка (локальная среда)

```bash
# Запуск всех сервисов для разработки
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d

# Только база данных и pgAdmin
docker-compose -f docker-compose.yml up postgres_dev pgadmin -d

# Остановка всех сервисов
docker-compose -f docker-compose.yml -f docker-compose.dev.yml down
```

```bash
# Статус всех контейнеров
docker-compose -f docker-compose.yml ps

# Логи конкретного сервиса
docker-compose logs -f backend

# Использование ресурсов
docker stats
```

```bash
# Войти в контейнер БД
docker exec -it postgres_dev psql -U jv13 -d cv_db_dev

# Проверить соединение с БД из бэкенда
docker exec backend_cv npm run test:db
```

# Генерация нового JWT секрета

node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Обновление Firebase ключей через Google Cloud Console

# Локальный деплой

## heroku container:push web -a ваш-проект

## heroku container:release web -a

## ваш-проект

# Просмотр логов Heroku

heroku logs --tail -a

# Сборка и пуш образов

docker build -f apps/backend/Dockerfile.backend -t ваш-registry/backend:latest .
docker push ваш-registry/backend:latest

# Проверить сеть Docker

docker network ls docker network inspect cv-network

# Проверить доступность БД из контейнера бэкенда

docker exec backend_cv ping

# Проверить сеть Docker

docker network ls docker network inspect cv-network

# Проверить доступность БД из контейнера бэкенда

docker exec backend_cv ping postgres_dev

# Проверить сеть Docker

docker network ls docker network inspect cv-network

# Проверить доступность БД из контейнера бэкенда

docker exec backend_cv ping postgres_dev

## 🔧 Исправления для ваших `docker-compose.*.yml`

Я заметил, что все три файла у вас **идентичны**. Вот как их нужно разделить:

### `docker-compose.yml` (базовый)

```yaml
version: '3.8'

services:
    postgres_prod:
        image: postgres:18
        container_name: postgres_prod
        environment:
            POSTGRES_DB: cv_db_prod
            POSTGRES_USER: jv13
            POSTGRES_PASSWORD: postgres
        ports:
            - '5432:5432'
        volumes:
            - postgres_data_prod:/var/lib/postgresql/data
            - ./database/backups:/backups
        healthcheck:
            test: ['CMD-SHELL', 'pg_isready -U jv13 -d cv_db_prod']
            interval: 10s
            timeout: 5s
            retries: 5
            start_period: 30s
        restart: unless-stopped
        networks:
            - cv-network

    postgres_dev:
        image: postgres:18
        container_name: postgres_dev
        environment:
            POSTGRES_DB: cv_db_dev
            POSTGRES_USER: jv13
            POSTGRES_PASSWORD: postgres
        ports:
            - '5433:5432'
        volumes:
            - postgres_data_dev:/var/lib/postgresql/data
        healthcheck:
            test: ['CMD-SHELL', 'pg_isready -U jv13 -d cv_db_dev']
            interval: 10s
            timeout: 5s
            retries: 5
            start_period: 30s
        restart: unless-stopped
        networks:
            - cv-network

    pgadmin:
        image: dpage/pgadmin4
        container_name: pgadmin_cv
        environment:
            PGADMIN_DEFAULT_EMAIL: ${PGADMIN_EMAIL:-admin@cv.com}
            PGADMIN_DEFAULT_PASSWORD: ${PGADMIN_PASSWORD:-admin}
        ports:
            - '${PGADMIN_PORT:-8082}:80'
        depends_on:
            postgres_prod:
                condition: service_healthy
            postgres_dev:
                condition: service_healthy
        restart: unless-stopped
        networks:
            - cv-network

networks:
    cv-network:
        driver: bridge

volumes:
    postgres_data_prod:
    postgres_data_dev:
```

```yaml
version: '3.8'

services:
    backend:
        build:
            context: ./apps/backend
            dockerfile: Dockerfile.backend
            target: development
        container_name: backend_cv
        environment:
            - NODE_ENV=development
            - DOCKER_CONTAINER=true
            - POSTGRES_HOST=postgres_dev
            - POSTGRES_PORT=5432
            - POSTGRES_DB=cv_db_dev
            - POSTGRES_USER=jv13
            - POSTGRES_PASSWORD=postgres
        ports:
            - '3000:3000'
        volumes:
            - ./apps/backend:/app
            - /app/node_modules
        depends_on:
            postgres_dev:
                condition: service_healthy
        restart: unless-stopped
        networks:
            - cv-network

    frontend:
        build:
            context: ./apps/frontend
            dockerfile: Dockerfile.frontend
            target: development
        container_name: frontend_cv
        environment:
            - NODE_ENV=development
            - API_URL=http://backend:3000
            - SSR=false
        ports:
            - '4200:4200'
        volumes:
            - ./apps/frontend:/app
            - /app/node_modules
        depends_on:
            - backend
        restart: unless-stopped
        networks:
            - cv-network
```

```yaml
version: '3.8'

services:
    backend:
        build:
            context: ./apps/backend
            dockerfile: Dockerfile.backend
            target: production
        container_name: backend_cv_prod
        environment:
            - NODE_ENV=production
            - DOCKER_CONTAINER=true
            - POSTGRES_HOST=postgres_prod
            - POSTGRES_PORT=5432
            - POSTGRES_DB=cv_db_prod
            - POSTGRES_USER=jv13
            - POSTGRES_PASSWORD=postgres
        depends_on:
            postgres_prod:
                condition: service_healthy
        restart: always
        networks:
            - cv-network

    frontend:
        build:
            context: ./apps/frontend
            dockerfile: Dockerfile.frontend
            target: production
        container_name: frontend_cv_prod
        environment:
            - NODE_ENV=production
            - API_URL=http://backend:3000
            - SSR=true
        depends_on:
            - backend
        restart: always
        networks:
            - cv-network

    nginx:
        build:
            context: ./apps/nginx
            dockerfile: Dockerfile.nginx
        container_name: nginx_cv
        ports:
            - '80:80'
            - '443:443'
        depends_on:
            - frontend
            - backend
        restart: always
        networks:
            - cv-network
```
