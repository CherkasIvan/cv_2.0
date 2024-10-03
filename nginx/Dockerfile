# Use the official Nginx image as a base
FROM nginx:latest

# Remove the default Nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy the server block configuration
COPY ./default.conf /etc/nginx/conf.d/default.conf

# Expose container to listen on a desired port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]