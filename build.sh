#!/bin/bash

echo "Building and running the app..."

# Stop existing containers
docker-compose down

# Build and start new containers
docker-compose up --build -d

echo "App is running! Frontend: http://localhost:3000, Backend: http://localhost:5000/api/message"

