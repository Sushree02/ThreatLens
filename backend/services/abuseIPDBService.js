// Service for interacting with the AbuseIPDB API
// Docs: https://docs.abuseipdb.com/

const axios = require('axios');
const config = require('../config/config');
const logger = require('../utils/logger');

const BASE_URL = 'https://api.abuseipdb.com/api/v2/check';

/**
 * Checks an IP address's abuse reports and confidence score.
 */
async function checkIP(ip) {
  if (!config.providersConfigured.abuseIPDB) {
    return { available: false, reason: 'API key not configured' };
  }

  try {
    const response = await axios.get(BASE_URL, {
      params: { ipAddress: ip, maxAgeInDays: 90 },
      headers: {
        Key: config.apiKeys.abuseIPDB,
        Accept: 'application/json'
      },
      timeout: 10000
    });

    const data = response.data?.data || {};

    return {
      available: true,
      abuseConfidenceScore: data.abuseConfidenceScore || 0,
      totalReports: data.totalReports || 0,
      isPublic: data.isPublic,
      countryCode: data.countryCode || 'Unknown',
      isp: data.isp || 'Unknown'
    };
  } catch (error) {
    logger.warn('AbuseIPDB check failed', error.message);
    return { available: false, reason: 'Request failed' };
  }
}

module.exports = { checkIP };
