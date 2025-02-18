const express = require('express');
const promClient = require('prom-client');

const app = express();
const PORT = process.env.PORT || 3001;

// Prometheus Metrics Setup
const collectDefaultMetrics = promClient.collectDefaultMetrics;
collectDefaultMetrics();

const pageLoadCounter = new promClient.Counter({
    name: 'frontend_page_loads',
    help: 'Total number of page loads'
});

const requestDurationHistogram = new promClient.Histogram({
    name: 'frontend_request_duration_seconds',
    help: 'Histogram of response duration in seconds',
    buckets: [0.1, 0.5, 1, 2, 5] // Buckets for latency tracking
});

// Middleware to track request duration
app.use((req, res, next) => {
    pageLoadCounter.inc();
    const start = Date.now();

    res.on('finish', () => {
        const duration = (Date.now() - start) / 1000;
        requestDurationHistogram.observe(duration);
        console.log(`[Metrics] Request processed in ${duration.toFixed(3)} seconds`);
    });

    next();
});

// Root Route for Basic Check
app.get('/', (req, res) => {
    res.send("Frontend Monitoring Server Running");
});

// Expose Prometheus Metrics
app.get('/metrics', async (req, res) => {
    try {
        res.set('Content-Type', promClient.register.contentType);
        res.end(await promClient.register.metrics());
    } catch (err) {
        console.error("Error generating Prometheus metrics:", err);
        res.status(500).send("Failed to generate metrics");
    }
});

app.listen(PORT, () => {
    console.log(`Frontend monitoring server running on port ${PORT}`);
});
