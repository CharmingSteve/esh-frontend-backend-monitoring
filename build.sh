#!/bin/bash

# Set error handling
set -e  # Exit on any error
set -o pipefail  # Exit if any command in a pipe fails

# Define log file
LOG_FILE="build_$(date +%Y%m%d_%H%M%S).log"

# Logging function
log() {
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo "[$timestamp] $1" | tee -a "$LOG_FILE"
}

# Error handling function
handle_error() {
    local line_number=$1
    local error_code=$2
    log "ERROR: Script failed at line $line_number with exit code $error_code"
    log "Cleaning up containers and exiting..."
    docker-compose down 2>/dev/null || true
    exit 1
}

# Set up error trap
trap 'handle_error ${LINENO} $?' ERR

# Function to check if a container is healthy
check_container_health() {
    local service=$1
    local max_attempts=$2
    local attempt=1

    log "Checking health of $service..."
    while [ $attempt -le $max_attempts ]; do
        if docker-compose ps | grep $service | grep -q "Up"; then
            log "$service is healthy"
            return 0
        fi
        log "Attempt $attempt/$max_attempts: $service is not yet healthy, waiting..."
        sleep 5
        ((attempt++))
    done
    
    log "ERROR: $service failed to become healthy after $max_attempts attempts"
    return 1
}

# Main build process
main() {
    log "Starting build process..."

    # Check if docker is running
    if ! docker info >/dev/null 2>&1; then
        log "ERROR: Docker is not running"
        exit 1
    fi

    # Stop existing containers
    log "Stopping existing containers..."
    if ! docker-compose down; then
        log "WARNING: Failed to stop existing containers, continuing anyway..."
    fi

    # Remove old images (optional)
    log "Cleaning up old images..."
    if ! docker-compose rm -f; then
        log "WARNING: Failed to remove old containers"
    fi

    # Build and start new containers
    log "Building and starting containers..."
    if ! docker-compose up --build -d; then
        log "ERROR: Failed to build and start containers"
        exit 1
    fi

    # Check health of services
    check_container_health "backend" 6 || exit 1
    check_container_health "frontend" 6 || exit 1
    check_container_health "prometheus" 6 || exit 1
    check_container_health "grafana" 6 || exit 1

    # Verify ports are accessible
    log "Verifying service accessibility..."
    
    # Array of services to check
    declare -A services=(
        ["Frontend"]="3000"
        ["Backend"]="5000"
        ["Prometheus"]="9090"
        ["Grafana"]="3002"
    )

    for service in "${!services[@]}"; do
        port="${services[$service]}"
        if ! timeout 1 bash -c "cat < /dev/null > /dev/tcp/localhost/$port" 2>/dev/null; then
            log "ERROR: $service port $port is not accessible"
            exit 1
        fi
        log "$service is accessible on port $port"
    done

    # Print success message with service URLs
    log "🎉 Build completed successfully!"
    log "Services are available at:"
    log "- Frontend: http://localhost:3000"
    log "- Backend: http://localhost:5000/api/message"
    log "- Prometheus: http://localhost:9090"
    log "- Grafana: http://localhost:3002"
    
    # Check docker-compose logs for any warnings
    log "Checking for warnings in container logs..."
    docker-compose logs --tail=50 | grep -i "warn\|error" || true
}

# Run main function
main "$@"
