# Build Stage
FROM node:18-alpine as build

WORKDIR /app

# Copy package.json and package-lock.json first for caching
COPY package.json package-lock.json* ./

# Install frontend dependencies
RUN npm install

# Copy the entire frontend source code
COPY . . 

# Debug: Check if react-scripts is installed
RUN ls -la node_modules/.bin

# Build the React app
ENV NODE_OPTIONS="--openssl-legacy-provider"
RUN npm run build

# Serve with Nginx
FROM nginx:alpine

# Remove default nginx HTML files to prevent conflicts
RUN rm -rf /usr/share/nginx/html/*

# Copy built React frontend
COPY --from=build /app/build /usr/share/nginx/html

# Set Working Directory at /
WORKDIR /

# Install monitoring dependencies PROPERLY
WORKDIR /monitoring
COPY package.json package-lock.json* ./
RUN apk add --no-cache nodejs npm && npm install express prom-client

# Copy Express monitoring server
COPY server.js /server.js

# Expose ports
EXPOSE 80 3001

# needed env var
ENV NODE_PATH=/monitoring/node_modules

# Start monitoring server + Nginx together
CMD ["sh", "-c", "node /server.js & nginx -g 'daemon off;'"]
