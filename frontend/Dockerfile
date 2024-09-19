FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build:ssr

FROM node:18-alpine
WORKDIR /app
COPY --from=build /app/dist/cv_2.0 /app
COPY package*.json ./
RUN npm install --only=production
CMD ["node", "main.js"]
