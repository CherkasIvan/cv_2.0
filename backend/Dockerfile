# # Используем Node.js 20.13.1-alpine3.19 для сборки
# FROM node:20.13.1-alpine3.19 as build

<<<<<<< Updated upstream
# # Устанавливаем рабочую директорию
# WORKDIR /app/src
=======
# Устанавливаем рабочую директорию
WORKDIR /app
>>>>>>> Stashed changes

# # Копируем package.json и устанавливаем зависимости
# COPY package*.json ./
# RUN npm ci

# # Копируем все файлы и собираем приложение
# COPY . ./
# RUN npm run build

<<<<<<< Updated upstream
# # Используем Node.js 20.13.1-alpine3.19 для запуска
# FROM node:20.13.1-alpine3.19

FROM node:18-alpine
WORKDIR /app
COPY backend/package*.json ./
RUN npm install
COPY backend ./
CMD ["node", "server.js"]
=======
# Используем Node.js 20.13.1-alpine3.19 для запуска
FROM node:20.13.1-alpine3.19

WORKDIR /app
COPY --from=build /app/dist ./
CMD ["node", "main.js"]
EXPOSE 3000
>>>>>>> Stashed changes
