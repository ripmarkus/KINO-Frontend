FROM nginx:alpine

# Copy everything in the repo to Nginx's default folder
COPY . /usr/share/nginx/html

# Expose HTTP port
EXPOSE 80
