# Используем Node.js 20.13.1-alpine3.19 для сборки
FROM node:20.13.1-alpine3.19 as build

# Устанавливаем рабочую директорию
WORKDIR /app/src

# Копируем package.json и устанавливаем зависимости
COPY package*.json ./
RUN npm ci

# Копируем все файлы и собираем приложение
COPY . ./
RUN npm run build

# Используем Node.js 20.13.1-alpine3.19 для запуска
FROM node:20.13.1-alpine3.19

# Создаем пользователя и группу
RUN addgroup -S exampleusergroup && adduser -S exampleuser -G exampleusergroup
USER exampleuser

# Устанавливаем рабочую директорию
WORKDIR /usr/app

# Копируем собранное приложение
COPY --from=build /app/src/dist/cv_2.0/ ./

# Указываем команду для запуска приложения
CMD ["node", "server/server.mjs"]

# Открываем порт, на котором будет работать приложение
EXPOSE 4000
