# # Используем Node.js 20.13.1-alpine3.19 для сборки
# FROM node:20.13.1-alpine3.19 as build

# # Устанавливаем рабочую директорию
# WORKDIR /app/src

# # Копируем package.json и устанавливаем зависимости
# COPY package*.json ./
# RUN npm ci

# # Копируем все файлы и собираем приложение
# COPY . ./
# RUN npm run build

# # Используем Node.js 20.13.1-alpine3.19 для запуска
# FROM node:20.13.1-alpine3.19

FROM node:18-alpine
WORKDIR /app
COPY backend/package*.json ./
RUN npm install
COPY backend ./
CMD ["node", "server.js"]