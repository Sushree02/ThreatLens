// Service for interacting with the VirusTotal API (v3)
// Docs: https://developers.virustotal.com/reference

const axios = require('axios');
const crypto = require('crypto');
const FormData = require('form-data');
const config = require('../config/config');
const logger = require('../utils/logger');

const BASE_URL = 'https://www.virustotal.com/api/v3';

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Extracts a normalized { malicious, suspicious, harmless, undetected, totalEngines }
 * shape from a VirusTotal "last_analysis_stats" or "stats" object.
 */
function normalizeStats(stats = {}) {
  const malicious = stats.malicious || 0;
  const suspicious = stats.suspicious || 0;
  const harmless = stats.harmless || 0;
  const undetected = stats.undetected || 0;
  const totalEngines = malicious + suspicious + harmless + undetected;
  return {
    available: true,
    malicious,
    suspicious,
    harmless,
    undetected,
    totalEngines: totalEngines || 1
  };
}

/**
 * Analyzes a URL using VirusTotal.
 * Returns { available: false } if the API key is missing or the
 * request fails, so the rest of the app can gracefully skip it.
 */
async function analyzeURL(targetUrl) {
  if (!config.providersConfigured.virusTotal) {
    return { available: false, reason: 'API key not configured' };
  }

  try {
    const urlId = Buffer.from(targetUrl).toString('base64').replace(/=+$/, '');

    // Submit the URL for analysis (VirusTotal requires submission before lookup
    // for URLs it hasn't seen recently), then fetch the report.
    await axios.post(
      `${BASE_URL}/urls`,
      new URLSearchParams({ url: targetUrl }),
      {
        headers: {
          'x-apikey': config.apiKeys.virusTotal,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        timeout: 10000
      }
    );

    const response = await axios.get(`${BASE_URL}/urls/${urlId}`, {
      headers: { 'x-apikey': config.apiKeys.virusTotal },
      timeout: 10000
    });

    const stats = response.data?.data?.attributes?.last_analysis_stats || {};
    return normalizeStats(stats);
  } catch (error) {
    logger.warn('VirusTotal URL analysis failed', error.message);
    return { available: false, reason: 'Request failed' };
  }
}

/**
 * Analyzes an IP address reputation using VirusTotal.
 */
async function analyzeIP(ip) {
  if (!config.providersConfigured.virusTotal) {
    return { available: false, reason: 'API key not configured' };
  }

  try {
    const response = await axios.get(`${BASE_URL}/ip_addresses/${ip}`, {
      headers: { 'x-apikey': config.apiKeys.virusTotal },
      timeout: 10000
    });

    const stats = response.data?.data?.attributes?.last_analysis_stats || {};
    return normalizeStats(stats);
  } catch (error) {
    logger.warn('VirusTotal IP analysis failed', error.message);
    return { available: false, reason: 'Request failed' };
  }
}

/**
 * Analyzes an uploaded file's SHA256 hash on VirusTotal. If the file
 * is already known (fast path), returns immediately. Otherwise it
 * uploads the file and polls the analysis endpoint until complete.
 */
async function analyzeFile(buffer, filename) {
  if (!config.providersConfigured.virusTotal) {
    return { available: false, reason: 'API key not configured' };
  }

  const sha256 = crypto.createHash('sha256').update(buffer).digest('hex');

  // Fast path: VirusTotal already has a report for this exact file hash.
  try {
    const existing = await axios.get(`${BASE_URL}/files/${sha256}`, {
      headers: { 'x-apikey': config.apiKeys.virusTotal },
      timeout: 10000
    });
    const stats = existing.data?.data?.attributes?.last_analysis_stats;
    if (stats) {
      return { ...normalizeStats(stats), sha256 };
    }
  } catch (lookupError) {
    // 404 just means VirusTotal hasn't seen this file before - continue to upload.
    logger.info('File hash not found on VirusTotal, uploading for fresh analysis.');
  }

  // Upload path: submit the file, then poll for the analysis result.
  try {
    const form = new FormData();
    form.append('file', buffer, filename);

    const uploadResponse = await axios.post(`${BASE_URL}/files`, form, {
      headers: {
        ...form.getHeaders(),
        'x-apikey': config.apiKeys.virusTotal
      },
      timeout: 30000,
      maxBodyLength: Infinity,
      maxContentLength: Infinity
    });

    const analysisId = uploadResponse.data?.data?.id;
    if (!analysisId) {
      return { available: false, reason: 'Upload did not return an analysis ID' };
    }

    let status = 'queued';
    let attempts = 0;
    let statsResult = null;

    while (attempts < 10 && status !== 'completed') {
      await sleep(3000);
      const pollResponse = await axios.get(`${BASE_URL}/analyses/${analysisId}`, {
        headers: { 'x-apikey': config.apiKeys.virusTotal },
        timeout: 10000
      });
      status = pollResponse.data?.data?.attributes?.status;
      statsResult = pollResponse.data?.data?.attributes?.stats;
      attempts += 1;
    }

    if (status !== 'completed' || !statsResult) {
      return { available: false, reason: 'Analysis did not complete in time. Please try again shortly.' };
    }

    return { ...normalizeStats(statsResult), sha256 };
  } catch (error) {
    logger.warn('VirusTotal file analysis failed', error.message);
    return { available: false, reason: 'Request failed' };
  }
}

module.exports = { analyzeURL, analyzeIP, analyzeFile };
