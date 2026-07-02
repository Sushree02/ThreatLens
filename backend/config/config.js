// Central config file - reads all secrets from process.env
// Never hardcode API keys here.
require('dotenv').config();

const config = {
  port: process.env.PORT || 5000,
  apiKeys: {
    virusTotal: process.env.VIRUSTOTAL_API_KEY || '',
    abuseIPDB: process.env.ABUSEIPDB_API_KEY || '',
    ipQualityScore: process.env.IPQUALITYSCORE_API_KEY || ''
  }
};

// Helper flags so the rest of the app can easily check which
// threat intel providers are actually configured.
config.providersConfigured = {
  virusTotal: Boolean(config.apiKeys.virusTotal),
  abuseIPDB: Boolean(config.apiKeys.abuseIPDB),
  ipQualityScore: Boolean(config.apiKeys.ipQualityScore)
};

// File upload settings for the "Analyze File" feature.
config.fileUpload = {
  allowedExtensions: ['pdf', 'doc', 'docx', 'zip', 'exe', 'apk', 'png', 'jpg', 'jpeg'],
  maxSizeBytes: 32 * 1024 * 1024 // 32 MB, matching VirusTotal's public upload limit
};

module.exports = config;
