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

## 🛠 Build Script (build.sh)

The `build.sh` script automates the build and deployment process with comprehensive error handling and logging.

### Features

#### 1. Logging System
- Creates timestamped log files (`build_YYYYMMDD_HHMMSS.log`)
- Logs all operations with timestamps
- Maintains both console and file logging
- Tracks warnings and errors

#### 2. Error Handling
- Implements sophisticated error trapping
- Provides detailed error messages with line numbers
- Performs cleanup on failure
- Handles Docker and network-related errors

#### 3. Health Checks
Verifies the health of all services:
- Backend (port 5000)
- Frontend (port 3000)
- Prometheus (port 9090)
- Grafana (port 3002)

#### 4. Build Process
1. **Pre-flight Checks**
   - Verifies Docker daemon is running
   - Checks for required ports availability

2. **Cleanup Phase**
   - Stops existing containers
   - Removes old containers
   - Cleans up unused resources

3. **Build Phase**
   - Builds all services
   - Starts containers in detached mode
   - Verifies successful startup

4. **Verification Phase**
   - Checks container health
   - Verifies port accessibility
   - Validates service responses

### Usage

```bash
# Make the script executable
chmod +x build.sh

# Run the build script
./build.sh
```

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
## Grafana Access and Configuration

### Accessing the Grafana Instance

Access your local Grafana instance via the following URL:

- **Grafana URL:** [http://localhost:3002](http://localhost:3002)

### Default Credentials (Local Test Environment)

> :warning: **Important Security Note:** The credentials provided below are for this local test environment *only*.  The password is hardcoded in the `docker-compose` file for convenience.  **Do not use these credentials in a production environment.** In a production setup, store sensitive information like usernames and passwords in a `.env` file that is *excluded* from your version control system (e.g., add `.env` to your `.gitignore` file).

| Credential | Value      |
| :--------- | :--------- |
| Username   | `steve`    |
| Password   | `gindi`    |

### Checking Grafana Logs

To view the logs for your Grafana container, use the following `docker-compose` command:

```bash
docker-compose logs grafana
```

## Grafana Monitoring Dashboards

This project includes a comprehensive set of Grafana dashboards for monitoring different aspects of the application:

### 1. Service Health Dashboard
[Primary dashboard for overall system health monitoring](http://localhost:3002/d/service-health-v1/service-health-dashboard):
- **Service Status**: UP/DOWN status for all services with color indicators
- **Response Times**: Average response times for all services
- **Error Rates**: Tracks system errors and failures
- **Service Dependencies**: Monitors inter-service communication health

### 2. Frontend Performance Dashboard
[Focuses on client-side performance metrics](http://localhost:3002/d/frontend-perf/frontend-performance-dashboard):
- **Page Load Times**: Average and peak loading times for frontend pages
- **Request Rate**: Number of page loads and API calls per second
- **Memory Usage**: Frontend application memory consumption
- **CPU Usage**: Frontend processing utilization
- **Event Loop Performance**: Node.js event loop lag monitoring

### 3. Backend Performance Dashboard
[Monitors API and server performance](http://localhost:3002/d/backend-perf/backend-performance-dashboard):
- **API Response Times**: Detailed timing for backend endpoints
- **Request Rates**: Tracks API calls per endpoint
- **Error Count**: Number of backend errors
- **Memory & CPU**: Resource usage tracking
- **Total Requests**: Overall system load monitoring

### 4. Business Metrics Dashboard
[Tracks business-relevant performance indicators](http://localhost:3002/d/business-metrics-v5/business-metrics-dashboard):
- **User Activity**: Real-time tracking of API requests and page views
- **Response Times**: Both frontend and backend response times
- **Total Requests**: Overall system usage patterns

### 5. Infrastructure Dashboard
[Monitors system-level metrics](http://localhost:3002/d/infrastructure-dash/infrastructure-dashboard):
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

## Alerts (Important Note)

Alerting functionality has NOT been configured in this project. However, please be aware that **alert configurations cannot be directly included in automated assessments** without specific knowledge of the Grafana instance's data source UIDs.

Alert rules in Grafana rely on a unique identifier (`datasourceUid`) for each data source (like Prometheus).  This `datasourceUid` is *specific to each Grafana instance* and will change when Grafana is deployed in a new environment (e.g., a different Docker container, a different machine).

Therefore, to enable alerts in your own Grafana instance, you will need to:

1. **Configure your Prometheus data source** within your Grafana instance.
2. **Find the `datasourceUid`** of your Prometheus data source (Configuration -> Data sources -> your Prometheus data source).
3. **Update the `alerting.yml` file** with the correct `datasourceUid`.
4. **Restart Grafana.**

Because these steps require manual configuration and access to the Grafana UI, they cannot be fully automated as part of an assessment. 

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

## Environment Variables Documentation

### Backend Service
| Variable | Default | Description |
|----------|---------|-------------|
| BACKEND_PORT | 5000 | Port on which the backend server runs |
| API_PATH | /api | Base path for all API endpoints |
| NODE_ENV | production | Node.js environment setting |
| PORT | 5000 | Alternative port setting (can be consolidated with BACKEND_PORT) |
| LOG_LEVEL | debug | Controls logging verbosity (debug, info, warn, error) |
| PROMETHEUS_METRICS_ENABLED | true | Enables/disables Prometheus metrics collection |

### Frontend Service
| Variable | Default | Description |
|----------|---------|-------------|
| REACT_APP_LOG_LEVEL | debug | Controls React application logging level |
| REACT_APP_API_BASE_URL | http://backend:5000 | Backend API URL for frontend requests |
| NODE_ENV | production | Ensures React runs in production mode with optimizations |

### Frontend Monitor Service
| Variable | Default | Description |
|----------|---------|-------------|
| NODE_PATH | /monitoring/node_modules | Path to Node.js modules for monitoring |
| METRICS_PORT | 3001 | Port for exposing frontend metrics |
| METRICS_PATH | /metrics | Endpoint path for Prometheus metrics |

### Prometheus Service
| Variable | Default | Description |
|----------|---------|-------------|
| PROMETHEUS_CONFIG | /etc/prometheus/prometheus.yml | Path to Prometheus configuration file |
| PROMETHEUS_STORAGE_TSDB_RETENTION_TIME | 15d | Duration to retain metrics data |

#### Optional Prometheus Variables (Currently Commented)
| Variable | Default | Description |
|----------|---------|-------------|
| PROMETHEUS_WEB_ENABLE_ADMIN_API | true | Enables Prometheus admin API |
| PROMETHEUS_WEB_BASIC_AUTH_USERNAME | admin | Username for basic auth |
| PROMETHEUS_WEB_BASIC_AUTH_PASSWORD | secure | Password for basic auth |
| PROMETHEUS_WEB_ENABLE_LIFECYCLE | true | Enables lifecycle endpoints |
| PROMETHEUS_STORAGE_TSDB_RETENTION_SIZE | 5GB | Maximum size of stored metrics |
| PROMETHEUS_WEB_EXTERNAL_URL | http://prometheus:9090 | External URL for Prometheus |
| PROMETHEUS_WEB_ROUTE_PREFIX | / | URL prefix for all Prometheus routes |
| PROMETHEUS_STORAGE_TSDB_WAL_COMPRESSION | true | Enables WAL compression |
| PROMETHEUS_QUERY_MAX_SAMPLES | 50000000 | Maximum samples in a query |

### Grafana Service
| Variable | Default | Description |
|----------|---------|-------------|
| GF_SECURITY_ADMIN_USER | steve | Grafana admin username |
| GF_SECURITY_ADMIN_PASSWORD | gindi | Grafana admin password |
| GF_USERS_ALLOW_SIGN_UP | false | Controls user registration |
| GF_LOG_LEVEL | debug | Grafana logging level |
| GF_DATABASE_TYPE | sqlite3 | Database type for Grafana |
| GF_PATHS_PROVISIONING | /usr/share/grafana/conf/provisioning | Path for provisioning configs |

### Usage Notes

1. **Security Variables**:
   - Change default passwords in production
   - Consider using Docker secrets for sensitive values
   - Enable authentication for Prometheus in production

2. **Logging Variables**:
   - Reduce log levels in production (change 'debug' to 'info' or 'warn')
   - Consider log rotation settings

3. **Performance Variables**:
   - Adjust retention settings based on available storage
   - Monitor metrics storage growth
   - Tune query limits based on usage

4. **Development vs Production**:
   - Some variables might need different values in development
   - Consider using .env files for environment-specific settings
## Security Considerations

Ensuring security in this monitoring stack is crucial to protect sensitive metrics, prevent unauthorized access, and maintain system integrity. Below are the key security measures implemented and additional best practices for securing the installation.

### **1. Restrict Grafana Access**
- By default, Grafana is exposed on `localhost:3002`. Ensure it is not publicly accessible unless necessary.
- Configure **user authentication** in Grafana using an **admin password** instead of default credentials.
- **Restrict login attempts** to mitigate brute-force attacks.

### **2. Protect Prometheus & API Endpoints**
- Prometheus metrics are openly accessible on `/metrics`. Consider enabling **basic authentication** or **IP whitelisting** to restrict access.
- **CORS policy** is configured to allow only trusted frontend services to communicate with the backend.
- Backend API endpoints should validate and sanitize inputs to prevent **injection attacks**.

### **3. Secure Docker & Nginx Configuration**
- **Limit container privileges**: Ensure that containers do not run as `root`.
- **Use read-only filesystems** for Grafana and Prometheus to prevent unauthorized modifications.
- **Enable HTTPS** in Nginx to encrypt communication (requires a TLS certificate).
- **Prevent open proxy issues** in Nginx by strictly defining `proxy_pass` rules.

### **4. Protect Data Sources**
- If Grafana connects to databases or external services, ensure credentials are stored securely using **environment variables** or Grafana’s **secure storage**.
- Use **role-based access control (RBAC)** to limit data access based on user permissions.

### **5. Logging & Monitoring**
- **Monitor access logs** for suspicious activity.
- **Enable audit logs** in Grafana to track configuration changes and unauthorized login attempts.
- Set up alerts in Prometheus to detect **unexpected spikes in resource usage**, indicating potential abuse.

### **6. Container & Image Security**
- Regularly **update Docker images** to patch vulnerabilities.
- **Use minimal base images** for all services to reduce the attack surface.
- Scan Docker images with **security tools** like Trivy or Clair before deployment.

### **7. Firewall & Network Security**
- Configure a **firewall** to restrict external access to services.
- **Disable unused ports** and services inside containers.
- **Use network segmentation**: Run backend services in a private network, exposing only necessary endpoints.

### **8. Backup & Recovery**
- **Regularly back up** Grafana dashboards, Prometheus configurations, and backend API data.
- Have a **disaster recovery plan** to restore services in case of an attack or failure.

By implementing these security measures, you can significantly reduce the risk of unauthorized access, data leaks, and service disruptions in this monitoring stack.

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
 
## **OpenTelemetry (OTel) Tracing - Observability Discussion - NOT imlpimented**

### **Why Tracing Matters in Modern Observability**
In distributed systems, monitoring just logs and metrics is not enough. **Tracing** allows engineers to track requests as they move through multiple services, helping diagnose bottlenecks and understand dependencies.

While this project primarily focuses on **metrics (Prometheus)** and **visualization (Grafana)**, tracing would be a valuable addition for **deep-dive debugging and root cause analysis**.

---

### **My Experience with OpenTelemetry**
I have worked on **OpenTelemetry (OTel) tracing projects**, particularly for **Spring Boot developers**, enabling them to gain deeper insights into their microservices. These projects involved:
- **Instrumenting Java-based microservices** with OpenTelemetry SDKs.
- **Exporting traces to distributed tracing backends** such as **Jaeger** and **Grafana Tempo**.
- **Correlating logs, metrics, and traces** to provide full observability.
- **Optimizing tracing configurations** to balance performance and trace granularity.

Through this experience, I have seen firsthand how **tracing bridges the gap between request flow visibility and debugging latency issues**.

---

### **How Tracing Could Be Integrated Here**
Although tracing is **not implemented in this project**, a future enhancement could include:
- **Adding OpenTelemetry SDKs** to **frontend and backend** for distributed tracing.
- **Sending traces to a collector** (e.g., OpenTelemetry Collector, Jaeger).
- **Correlating request logs with trace IDs** for better debugging.
- **Visualizing traces in Grafana** alongside existing dashboards.

This would provide **end-to-end observability** by showing **how requests flow through the system, where they slow down, and what dependencies contribute to performance bottlenecks**.

---

### **Conclusion**
Observability is best achieved when **logs, metrics, and traces work together**. While this project focuses on **metrics and monitoring**, tracing is a natural next step for achieving a **full-stack observability solution**. My prior experience with OpenTelemetry in **Spring Boot microservices** has shown its effectiveness in improving system transparency, and a similar approach could be applied here in the future.
