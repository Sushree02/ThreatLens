// Simple console-based logger with timestamps.
// Kept intentionally lightweight for a beginner-friendly project.

const timestamp = () => new Date().toISOString();

const logger = {
  info: (message, meta = '') => {
    console.log(`[INFO] ${timestamp()} - ${message}`, meta || '');
  },
  warn: (message, meta = '') => {
    console.warn(`[WARN] ${timestamp()} - ${message}`, meta || '');
  },
  error: (message, meta = '') => {
    console.error(`[ERROR] ${timestamp()} - ${message}`, meta || '');
  }
};

module.exports = logger;
