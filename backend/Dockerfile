# Use the official Node.js image.
# https://hub.docker.com/_/node
FROM node:18

# Create and change to the app directory.
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
COPY package*.json ./

# Install production dependencies.
RUN npm install --only=production

# Copy local code to the container image.
COPY . .

# Run the web service on container startup.
CMD [ "npm", "run", "start:prod" ]

EXPOSE 3000

# # Используем официальный образ Node.js
# FROM node:18

# # Устанавливаем рабочую директорию
# WORKDIR /app

# # Копируем package.json и package-lock.json
# COPY package*.json ./

# # Устанавливаем зависимости
# RUN npm install

# # Копируем остальные файлы проекта
# COPY . .

# # Собираем приложение
# RUN npm run build

# # Указываем команду для запуска приложения
# CMD ["node", "dist/main"]