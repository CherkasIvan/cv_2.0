# Используем официальный образ Node.js
FROM node:18

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем остальные файлы проекта
COPY . .

# Собираем приложение
RUN npm run build --prod

# Устанавливаем сервер для обслуживания статических файлов
RUN npm install -g http-server

# Указываем команду для запуска приложения
CMD ["http-server", "dist/cv_2.0"]
