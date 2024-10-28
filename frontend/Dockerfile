FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN apt-get update && apt-get install -y iproute2
RUN npm run build:ssr
EXPOSE 4000
CMD ["http-server", "npm", "run", "serve:ssr", "--verbose"]
