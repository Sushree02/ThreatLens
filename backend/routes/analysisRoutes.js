const express = require('express');
const multer = require('multer');
const router = express.Router();

const config = require('../config/config');

const {
  analyzeUrlController,
  analyzeIpController,
  analyzeFileController
} = require('../controllers/analysisController');

const {
  validateUrlBody,
  validateIpBody,
  validateFileUpload
} = require('../middleware/validateRequest');

// Files are kept in memory (not written to disk) and streamed
// straight to VirusTotal. This keeps the server stateless.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: config.fileUpload.maxSizeBytes }
});

router.post('/analyze-url', validateUrlBody, analyzeUrlController);
router.post('/analyze-ip', validateIpBody, analyzeIpController);
router.post('/analyze-file', upload.single('file'), validateFileUpload, analyzeFileController);

module.exports = router;
