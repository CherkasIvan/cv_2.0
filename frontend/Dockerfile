# FROM node:18-alpine AS build
# WORKDIR /app
# COPY package*.json ./
# RUN npm install --legacy-peer-deps
# COPY . .
# RUN npm run build:ssr

<<<<<<< Updated upstream
# FROM node:18-alpine
# WORKDIR /app
# COPY --from=build /app/dist/cv_2.0-server /app
# CMD ["node", "main.js"]
=======
# Устанавливаем рабочую директорию
WORKDIR /app
>>>>>>> Stashed changes

FROM node:18-alpine AS build
WORKDIR /app
COPY frontend/package*.json ./
RUN npm install --legacy-peer-deps
COPY frontend ./
RUN npm run build:ssr

<<<<<<< Updated upstream
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
=======
# Копируем все файлы и собираем приложение
COPY . ./
RUN npm run build:ssr

# Используем Node.js 20.13.1-alpine3.19 для запуска
FROM node:20.13.1-alpine3.19

WORKDIR /app
COPY --from=build /app/dist ./
CMD ["node", "server/main.js"]
EXPOSE 4000
>>>>>>> Stashed changes
