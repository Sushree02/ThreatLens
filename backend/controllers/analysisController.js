// Controllers handle the request/response cycle and delegate the
// actual work to the analysisService.

const path = require('path');
const analysisService = require('../services/analysisService');
const logger = require('../utils/logger');

async function analyzeUrlController(req, res, next) {
  try {
    const { url } = req.body;
    logger.info(`Analyzing URL: ${url}`);
    const result = await analysisService.analyzeUrl(url);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

async function analyzeIpController(req, res, next) {
  try {
    const { ip } = req.body;
    logger.info(`Analyzing IP: ${ip}`);
    const result = await analysisService.analyzeIp(ip);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

async function analyzeFileController(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file was uploaded.' });
    }

    const { buffer, originalname, size } = req.file;
    const extension = path.extname(originalname).replace('.', '').toLowerCase();

    logger.info(`Analyzing file: ${originalname} (${size} bytes)`);
    const result = await analysisService.analyzeFile({
      buffer,
      originalName: originalname,
      size,
      extension
    });
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

module.exports = { analyzeUrlController, analyzeIpController, analyzeFileController };
