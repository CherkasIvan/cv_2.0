# Используем официальный образ Node.js в качестве базового
FROM node:18-alpine AS build

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json в рабочую директорию
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем все файлы в рабочую директорию
COPY . .

# Собираем приложение
RUN npm run build:ssr

# Используем Nginx для сервировки приложения
FROM nginx:alpine

# Копируем собранные файлы из предыдущего этапа
COPY --from=build /app/dist /usr/share/nginx/html

# Копируем конфигурацию Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Открываем порт, на котором будет работать приложение
EXPOSE 80

# Запускаем Nginx
CMD ["nginx", "-g", "daemon off;"]
