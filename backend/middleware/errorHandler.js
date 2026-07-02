// Centralized error-handling middleware. Ensures the API never
// crashes and always returns a clean JSON error response.

const logger = require('../utils/logger');

function errorHandler(err, req, res, next) {
  logger.error('Unhandled error', err.stack || err.message);

  // Friendly message for file-too-large errors from multer.
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'File is too large. Please upload a smaller file.'
    });
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Something went wrong on the server. Please try again.'
  });
}

function notFoundHandler(req, res) {
  res.status(404).json({ success: false, message: 'Route not found.' });
}

module.exports = { errorHandler, notFoundHandler };
