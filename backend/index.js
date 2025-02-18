const express = require('express');
const cors = require('cors');
const promClient = require('prom-client');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Prometheus Metrics Setup
const collectDefaultMetrics = promClient.collectDefaultMetrics;
collectDefaultMetrics();

const requestCounter = new promClient.Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests received'
});

const responseTimeHistogram = new promClient.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Histogram of response time',
    buckets: [0.1, 0.5, 1, 2, 5]
});

const errorCounter = new promClient.Counter({
    name: 'http_errors_total',
    help: 'Total number of HTTP errors'
});

// Middleware to track requests, response time, and errors
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    console.log("Headers:", req.headers);
    if (req.body && Object.keys(req.body).length > 0) {
        console.log("Body:", req.body);
    }

    // Start timer for response duration
    const endTimer = responseTimeHistogram.startTimer();
    requestCounter.inc();

    res.on('finish', () => {
        console.log(`[${new Date().toISOString()}] Response: ${res.statusCode} ${res.statusMessage}`);
        endTimer(); // Stop the Prometheus timer
        if (res.statusCode >= 400) {
            errorCounter.inc(); // Increment error counter if status is 4xx or 5xx
        }
    });

    next();
});

// API Route: Returns a simple message
app.get('/api/message', (req, res) => {
    try {
        res.json({ message: "Hello from backend!" });
    } catch (err) {
        next(err); // Pass error to global error handler
    }
});

// Metrics route for Prometheus
app.get('/metrics', async (req, res, next) => {
    try {
        console.log(`[${new Date().toISOString()}] Serving Prometheus Metrics`);
        res.set('Content-Type', promClient.register.contentType);
        res.end(await promClient.register.metrics());
    } catch (err) {
        next(err);
    }
});

// Handle 404 Not Found
app.use((req, res, next) => {
    res.status(404).json({ error: "Not Found" });
});

// Global error-handling middleware
app.use((err, req, res, next) => {
    console.error(`[${new Date().toISOString()}] ERROR:`, err.message);
    errorCounter.inc(); // Track errors in Prometheus

    res.status(err.status || 500).json({
        error: err.message || "Internal Server Error",
    });
});

// Start the backend server
app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
});
