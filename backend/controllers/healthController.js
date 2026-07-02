const config = require('../config/config');

function getHealth(req, res) {
  res.status(200).json({
    success: true,
    status: 'ThreatLens backend is running',
    providersConfigured: config.providersConfigured,
    fileUpload: config.fileUpload,
    timestamp: new Date().toISOString()
  });
}

module.exports = { getHealth };
