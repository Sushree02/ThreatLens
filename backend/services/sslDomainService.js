// Lightweight service for checking HTTPS/SSL status and basic domain
// info without requiring a third-party API key. Uses Node's built-in
// https/tls modules and the public RDAP protocol for domain age.

const https = require('https');
const axios = require('axios');
const logger = require('../utils/logger');
const { extractDomain } = require('../utils/validators');

/**
 * Checks whether a URL uses HTTPS and whether its SSL certificate is valid.
 */
function checkSSL(targetUrl) {
  return new Promise((resolve) => {
    let parsedUrl;
    try {
      parsedUrl = new URL(targetUrl);
    } catch (err) {
      return resolve({ httpsEnabled: false, sslValid: false });
    }

    if (parsedUrl.protocol !== 'https:') {
      return resolve({ httpsEnabled: false, sslValid: false });
    }

    const req = https.request(
      {
        host: parsedUrl.hostname,
        port: 443,
        method: 'HEAD',
        path: parsedUrl.pathname || '/',
        timeout: 8000,
        rejectUnauthorized: false // we inspect validity manually below
      },
      (res) => {
        const cert = res.socket.getPeerCertificate();
        const authorized = res.socket.authorized;
        resolve({
          httpsEnabled: true,
          sslValid: Boolean(authorized),
          issuer: cert && cert.issuer ? cert.issuer.O || cert.issuer.CN : 'Unknown',
          validTo: cert ? cert.valid_to : null
        });
        req.destroy();
      }
    );

    req.on('timeout', () => {
      req.destroy();
      resolve({ httpsEnabled: true, sslValid: false, error: 'Timeout while checking SSL' });
    });

    req.on('error', () => {
      resolve({ httpsEnabled: true, sslValid: false, error: 'Could not verify SSL' });
    });

    req.end();
  });
}

/**
 * Fetches basic domain registration info (creation date -> age in days)
 * using the free public RDAP protocol. Falls back gracefully on failure.
 */
async function getDomainInfo(targetUrl) {
  const domain = extractDomain(targetUrl);
  if (!domain) return { domain: null, ageInDays: null, available: false };

  try {
    const response = await axios.get(`https://rdap.org/domain/${domain}`, {
      timeout: 8000
    });
    const events = response.data?.events || [];
    const registrationEvent = events.find((e) => e.eventAction === 'registration');
    if (!registrationEvent) {
      return { domain, ageInDays: null, available: true };
    }
    const registeredDate = new Date(registrationEvent.eventDate);
    const ageInDays = Math.floor((Date.now() - registeredDate.getTime()) / (1000 * 60 * 60 * 24));
    return { domain, ageInDays, registeredDate: registrationEvent.eventDate, available: true };
  } catch (error) {
    logger.warn('Domain info lookup failed', error.message);
    return { domain, ageInDays: null, available: false };
  }
}

module.exports = { checkSSL, getDomainInfo };
