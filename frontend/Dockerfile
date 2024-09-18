# Stage 1: Build Angular app
FROM node:18-alpine as builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Stage 2: Serve Angular app using NGINX
FROM nginx:1.20 as ngx
COPY --from=builder /app/dist/cv_2.0/browser /usr/share/nginx/html
COPY cv_2.0/nginx.conf /etc/nginx/conf.d/default.conf
RUN mkdir -p /var/cache/nginx/client_temp
RUN chown -R nginx:nginx /var/cache/nginx
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

# C:\Users\JohneyVoid13\Desktop\Projects\cv_2.0\nginx.conf
# nginx.conf
