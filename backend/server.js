// ThreatLens Backend - Main server entry point

const express = require('express');
const cors = require('cors');
const config = require('./config/config');
const logger = require('./utils/logger');

const requestLogger = require('./middleware/requestLogger');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const healthRoutes = require('./routes/healthRoutes');
const analysisRoutes = require('./routes/analysisRoutes');

const app = express();

// Core middleware
app.use(cors());
app.use(express.json());
app.use(requestLogger);

// Routes
app.use('/api', healthRoutes);
app.use('/api', analysisRoutes);

// 404 + error handling (must be registered last)
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(config.port, () => {
  logger.info(`ThreatLens backend running on http://localhost:${config.port}`);
  const missing = Object.entries(config.providersConfigured)
    .filter(([, ok]) => !ok)
    .map(([name]) => name);
  if (missing.length > 0) {
    logger.warn(`Missing API keys for: ${missing.join(', ')}. These providers will be skipped.`);
  }
});
