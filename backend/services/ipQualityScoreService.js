// Service for interacting with the IPQualityScore API
// Docs: https://www.ipqualityscore.com/documentation/overview

const axios = require('axios');
const config = require('../config/config');
const logger = require('../utils/logger');

/**
 * Checks IP fraud/risk score using IPQualityScore.
 */
async function checkIP(ip) {
  if (!config.providersConfigured.ipQualityScore) {
    return { available: false, reason: 'API key not configured' };
  }

  try {
    const url = `https://www.ipqualityscore.com/api/json/ip/${config.apiKeys.ipQualityScore}/${ip}`;
    const response = await axios.get(url, { timeout: 10000 });
    const data = response.data || {};

    return {
      available: true,
      riskScore: data.fraud_score || 0,
      isProxy: Boolean(data.proxy),
      isVpn: Boolean(data.vpn),
      isTor: Boolean(data.tor),
      recentAbuse: Boolean(data.recent_abuse)
    };
  } catch (error) {
    logger.warn('IPQualityScore check failed', error.message);
    return { available: false, reason: 'Request failed' };
  }
}

/**
 * Checks a URL's risk score using IPQualityScore's URL/malicious link endpoint.
 */
async function checkURL(targetUrl) {
  if (!config.providersConfigured.ipQualityScore) {
    return { available: false, reason: 'API key not configured' };
  }

  try {
    const encodedUrl = encodeURIComponent(targetUrl);
    const url = `https://www.ipqualityscore.com/api/json/url/${config.apiKeys.ipQualityScore}/${encodedUrl}`;
    const response = await axios.get(url, { timeout: 10000 });
    const data = response.data || {};

    return {
      available: true,
      riskScore: data.risk_score || 0,
      malware: Boolean(data.malware),
      phishing: Boolean(data.phishing),
      suspicious: Boolean(data.suspicious),
      spamming: Boolean(data.spamming)
    };
  } catch (error) {
    logger.warn('IPQualityScore URL check failed', error.message);
    return { available: false, reason: 'Request failed' };
  }
}

module.exports = { checkIP, checkURL };
