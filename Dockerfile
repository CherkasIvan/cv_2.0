# Stage 1: Build the Angular app
FROM node:18 AS build

WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем остальные файлы проекта
COPY . .

# Собираем приложение
RUN npm run build:ssr

# Stage 2: Serve the app with Nginx
FROM nginx:alpine

COPY --from=build /app/dist/cv_2.0/browser /usr/share/nginx/html
COPY --from=build /app/dist/cv_2.0/server /usr/share/nginx/html/server

COPY conf.d/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]