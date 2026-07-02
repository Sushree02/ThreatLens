// Middleware that validates incoming request bodies before they
// reach the controllers, returning friendly error messages.

const path = require('path');
const { isValidURL, isValidIP } = require('../utils/validators');
const config = require('../config/config');

function validateUrlBody(req, res, next) {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ success: false, message: 'A URL is required.' });
  }
  if (!isValidURL(url)) {
    return res.status(400).json({
      success: false,
      message: 'Please enter a valid URL, e.g. https://example.com'
    });
  }
  next();
}

function validateIpBody(req, res, next) {
  const { ip } = req.body;
  if (!ip) {
    return res.status(400).json({ success: false, message: 'An IP address is required.' });
  }
  if (!isValidIP(ip)) {
    return res.status(400).json({
      success: false,
      message: 'Please enter a valid IPv4 or IPv6 address.'
    });
  }
  next();
}

function validateFileUpload(req, res, next) {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Please select a file to analyze.' });
  }

  const { originalname, size } = req.file;
  const extension = path.extname(originalname).replace('.', '').toLowerCase();

  if (!config.fileUpload.allowedExtensions.includes(extension)) {
    return res.status(400).json({
      success: false,
      message: `File type ".${extension}" is not supported. Allowed types: ${config.fileUpload.allowedExtensions.join(', ')}.`
    });
  }

  if (size > config.fileUpload.maxSizeBytes) {
    const maxMB = Math.round(config.fileUpload.maxSizeBytes / (1024 * 1024));
    return res.status(400).json({
      success: false,
      message: `File is too large. Maximum allowed size is ${maxMB}MB.`
    });
  }

  next();
}

module.exports = { validateUrlBody, validateIpBody, validateFileUpload };
