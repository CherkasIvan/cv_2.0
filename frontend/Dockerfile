FROM node:18
WORKDIR /app
COPY package*.json ./
COPY angular.json ./
RUN npm install
COPY . .
RUN apt-get update && apt-get install -y iproute2
RUN npm run build
EXPOSE 4000
CMD [ "npm", "run", "serve:dev", "--verbose"]
