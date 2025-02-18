# Stage 1: Build dependencies
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files first for better caching
COPY package.json package-lock.json* ./

# Install only production dependencies
RUN npm install --only=production

# Copy the rest of the source code
COPY . .

# Stage 2: Run lightweight production server
FROM node:18-alpine

WORKDIR /app

# Copy only built dependencies and source files from the build stage
COPY --from=build /app /app

EXPOSE 5000

CMD ["node", "index.js"]
