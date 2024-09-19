# FROM node:18-alpine AS build
# WORKDIR /app
# COPY package*.json ./
# RUN npm install --legacy-peer-deps
# COPY . .
# RUN npm run build:ssr

# FROM node:18-alpine
# WORKDIR /app
# COPY --from=build /app/dist/cv_2.0-server /app
# CMD ["node", "main.js"]

FROM node:18-alpine AS build
WORKDIR /app
COPY frontend/package*.json ./
RUN npm install --legacy-peer-deps
COPY frontend ./
RUN npm run build:ssr

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
