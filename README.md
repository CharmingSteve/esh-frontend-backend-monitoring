# esh-frontend-backend-monitoring
A containerized web application with a React frontend and Express.js backend, orchestrated with Docker Compose. The app serves a Hello World message while demonstrating API communication between services.

## 📌 Requirements
### Prerequisites
Before running this project, ensure you have:
- [Docker](https://www.docker.com/get-started) installed
- [Docker Compose](https://docs.docker.com/compose/install/) installed
- [Node.js](https://nodejs.org/) (if running locally)
- [Git](https://git-scm.com/) (optional, for cloning)

## ⚙️ Setup Instructions
### Clone the Repository
```sh
git clone https://github.com/CharmingSteve/esh-frontend-backend-monitoring.git
cd esh-frontend-backend-monitoring
```

### Build and Start the Application
```sh
./build.sh
```
This script will:
1. Build the frontend and backend Docker images.
2. Start both services using `docker-compose up`.
3. Expose the following endpoints:
   - **Frontend:** [http://localhost:3000](http://localhost:3000)
   - **Backend API:** [http://localhost:5000/api/message](http://localhost:5000/api/message)

## 🖥️ Architecture Decisions
### 1. Technology Stack
| Component  | Technology Used          |
|------------|--------------------------|
| Frontend   | React (Create React App) |
| Backend    | Node.js + Express.js     |
| Containerization | Docker, Docker Compose |
| Build Automation | Shell script (`build.sh`) |

### 2. Service Communication
- The **frontend** makes an API request to the **backend** at `/api/message`.
- The **backend** serves a simple **JSON response**.
- Services are orchestrated via **Docker Compose**.

### 3. Multi-Stage Docker Builds
- The **frontend** is built using a **multi-stage** Dockerfile:
  - `Node.js` compiles the React app.
  - `Nginx` serves the built static files.
- The **backend** runs as a **lightweight Node.js container** with Express.js.

## 📦 Local Development Guide
### Running Without Docker
If you want to run the services locally without Docker:

#### 1️⃣ Start the Backend
```sh
cd backend
npm install
npm start
```
#### 2️⃣ Start the Frontend
```sh
cd frontend
npm install
npm start
```
#### 3️⃣ Access the App
- **Frontend:** [http://localhost:3000](http://localhost:3000)
- **Backend API:** [http://localhost:5000/api/message](http://localhost:5000/api/message)


# Monitoring & Logging Guide

## Backend
### Metrics:
- **Prometheus Endpoint**: [http://localhost:5000/metrics](http://localhost:5000/metrics)
- **cURL Command**:  
  ```sh
  curl http://localhost:5000/metrics
  ```

### Logs:
- **View logs (running container)**:  
  ```sh
  docker-compose logs backend
  ```
- **Stream logs in real-time**:  
  ```sh
  docker-compose logs -f backend
  ```

## Frontend Monitoring
### Metrics:
- **Prometheus Endpoint**: [http://localhost:3003/metrics](http://localhost:3003/metrics) *(if mapped to 3003)*
- **cURL Command**:  
  ```sh
  curl http://localhost:3003/metrics
  ```

### Logs:
- **View logs (running container)**:  
  ```sh
  docker-compose logs frontend-monitor
  ```
- **Stream logs in real-time**:  
  ```sh
  docker-compose logs -f frontend-monitor
  ```

## Prometheus
- **View all monitored targets**: [http://localhost:9090/targets](http://localhost:9090/targets)
- **Access Prometheus UI**: [http://localhost:9090](http://localhost:9090)
- **Check logs**:  
  ```sh
  docker-compose logs prometheus
  ```

## Grafana
- **Access Grafana**: [http://localhost:3002](http://localhost:3002)
- **Default Login**:  
  - Username: `steve`  
  - Password: `gindi` 
- **Check logs**:  
  ```sh
  docker-compose logs grafana
  ```

## Grafana Monitoring Dashboards

This project includes a comprehensive set of Grafana dashboards for monitoring different aspects of the application:

### 1. Service Health Dashboard
Primary dashboard for overall system health monitoring:
- **Service Status**: UP/DOWN status for all services with color indicators
- **Response Times**: Average response times for all services
- **Error Rates**: Tracks system errors and failures
- **Service Dependencies**: Monitors inter-service communication health

### 2. Frontend Performance Dashboard
Focuses on client-side performance metrics:
- **Page Load Times**: Average and peak loading times for frontend pages
- **Request Rate**: Number of page loads and API calls per second
- **Memory Usage**: Frontend application memory consumption
- **CPU Usage**: Frontend processing utilization
- **Event Loop Performance**: Node.js event loop lag monitoring

### 3. Backend Performance Dashboard
Monitors API and server performance:
- **API Response Times**: Detailed timing for backend endpoints
- **Request Rates**: Tracks API calls per endpoint
- **Error Count**: Number of backend errors
- **Memory & CPU**: Resource usage tracking
- **Total Requests**: Overall system load monitoring

### 4. Business Metrics Dashboard
Tracks business-relevant performance indicators:
- **User Activity**: Real-time tracking of API requests and page views
- **Response Times**: Both frontend and backend response times
- **Total Requests**: Overall system usage patterns

### 5. Infrastructure Dashboard
Monitors system-level metrics:
- **Container Health**: Status of all containerized services
- **Resource Usage**: CPU and Memory utilization by service
- **Node.js Metrics**: 
  - Heap usage monitoring
  - Event loop performance
  - Runtime metrics

### Dashboard Features
All dashboards include:
- 5-second real-time refresh
- 15-minute time window default
- Mean and max calculations
- Proper units (bytes, seconds, percentages)
- Smooth line interpolation
- Table-style legends with calculations

### Access and Navigation
- All dashboards are accessible through Grafana's UI
- Tagged for easy filtering (frontend, backend, infrastructure, etc.)
- Consistent color schemes for easy metric identification
- Customizable time ranges and refresh rates

### Technical Details
- Uses Prometheus as the data source
- Metrics collected from both frontend and backend services
- Container-level monitoring integration
- Node.js-specific performance tracking

## General Logs & Debugging
- **List all running containers**:  
  ```sh
  docker ps
  ```
- **Enter a container shell**:  
  ```sh
  docker exec -it <container_name> sh
  ```
- **Rebuild & restart monitoring**:  
  ```sh
  docker-compose down
  docker-compose up --build -d
  ```

## 🐞 Troubleshooting
### 1️⃣ Docker Build Fails
**Error:** `failed to compute cache key: failed to calculate checksum of ref...`  
**Solution:** Ensure `package-lock.json` exists before building:
```sh
cd frontend
npm install
cd backend
npm install
```
Then rebuild:
```sh
docker-compose down
docker system prune -af
./build.sh
```

### 2️⃣ Backend Not Responding
**Error:** `curl: (7) Failed to connect to localhost:5000`  
**Solution:** Check if the backend is running:
```sh
docker-compose logs backend
```
If it's not running, restart:
```sh
docker-compose restart backend
```

### 3️⃣ Frontend Not Loading
**Error:** `Cannot GET /`  
**Solution:** Ensure the frontend build was successful:
```sh
docker-compose logs frontend
```
If needed, rebuild the frontend:
```sh
docker-compose up --build frontend
```

### 4️⃣ Real-Life Troubleshooting: Missing Dependencies & Build Failures
During development, we encountered several stressful issues that required debugging:

**Issue:** `react-scripts not found` during `npm run build`  
**Root Cause:** `react-scripts` was missing from `package.json`, preventing the frontend from building.  
**Solution:** We manually added `react-scripts` and force-reinstalled dependencies using:
```sh
cd frontend
npm install react-scripts --save
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

**Issue:** `Could not find a required file: public/index.html`  
**Root Cause:** The React project was missing the `public/index.html` file, causing the build process to fail.  
**Solution:** We manually created the missing file:
```sh
mkdir frontend/public
touch frontend/public/index.html
```
And added basic HTML structure to ensure the frontend rendered correctly.

**Lesson Learned:**  
Even with a well-defined stack, minor issues with dependency management and missing files can cause major headaches. Careful debugging, using logs, and force-cleaning npm caches helped resolve these issues effectively.
