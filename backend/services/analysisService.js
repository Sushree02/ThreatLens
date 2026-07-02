// Orchestrates calls to all threat intelligence providers and the
// risk engine to produce a final, structured analysis result.

const virusTotalService = require('./virusTotalService');
const abuseIPDBService = require('./abuseIPDBService');
const ipQualityScoreService = require('./ipQualityScoreService');
const sslDomainService = require('./sslDomainService');
const { calculateRiskScore, getRiskLevel, getFinalVerdict } = require('../utils/riskEngine');
const {
  buildSummary,
  buildThreatFindings,
  buildRiskIndicators,
  buildFileSummary,
  buildFileFindings,
  buildFileRiskIndicators,
  buildRecommendations
} = require('../utils/recommendations');
const { generateScanId } = require('../utils/scanId');
const config = require('../config/config');

/**
 * Builds the list of warnings for any providers that are not configured.
 */
function buildProviderWarnings() {
  const warnings = [];
  const missing = Object.entries(config.providersConfigured)
    .filter(([, configured]) => !configured)
    .map(([name]) => name);

  if (missing.length > 0) {
    warnings.push('Additional threat intelligence providers not configured.');
  }
  return { warnings, missingProviders: missing };
}

function buildDetectionRatio(virusTotal) {
  if (!virusTotal || !virusTotal.available) return null;
  return `${virusTotal.malicious}/${virusTotal.totalEngines}`;
}

/**
 * Runs a full analysis for a URL.
 */
async function analyzeUrl(targetUrl) {
  const { warnings } = buildProviderWarnings();

  const [sslInfo, domainInfo, virusTotal, ipqsUrl] = await Promise.all([
    sslDomainService.checkSSL(targetUrl),
    sslDomainService.getDomainInfo(targetUrl),
    virusTotalService.analyzeURL(targetUrl),
    ipQualityScoreService.checkURL(targetUrl)
  ]);

  const ipQualityScore = ipqsUrl.available
    ? { available: true, riskScore: ipqsUrl.riskScore }
    : { available: false };

  const { riskScore, confidence } = calculateRiskScore({ virusTotal, ipQualityScore });
  const riskLevel = getRiskLevel(riskScore);
  const finalVerdict = getFinalVerdict(riskScore);

  return {
    scanId: generateScanId(),
    target: targetUrl,
    type: 'url',
    riskScore,
    riskLevel,
    confidence,
    detectionRatio: buildDetectionRatio(virusTotal),
    summary: buildSummary({ type: 'url', virusTotal, ipQualityScore }),
    findings: buildThreatFindings({ type: 'url', virusTotal }),
    riskIndicators: buildRiskIndicators({ type: 'url', sslInfo, domainInfo, ipQualityScore }),
    recommendations: buildRecommendations(riskLevel, 'url'),
    finalVerdict,
    details: { sslInfo, domainInfo, virusTotal, ipQualityScore: ipqsUrl },
    warnings,
    timestamp: new Date().toISOString()
  };
}

/**
 * Runs a full analysis for an IP address.
 */
async function analyzeIp(ip) {
  const { warnings } = buildProviderWarnings();

  const [virusTotal, abuseIPDB, ipQualityScore] = await Promise.all([
    virusTotalService.analyzeIP(ip),
    abuseIPDBService.checkIP(ip),
    ipQualityScoreService.checkIP(ip)
  ]);

  const { riskScore, confidence } = calculateRiskScore({ virusTotal, abuseIPDB, ipQualityScore });
  const riskLevel = getRiskLevel(riskScore);
  const finalVerdict = getFinalVerdict(riskScore);

  return {
    scanId: generateScanId(),
    target: ip,
    type: 'ip',
    riskScore,
    riskLevel,
    confidence,
    detectionRatio: buildDetectionRatio(virusTotal),
    summary: buildSummary({ type: 'ip', virusTotal, abuseIPDB, ipQualityScore }),
    findings: buildThreatFindings({ type: 'ip', virusTotal, abuseIPDB }),
    riskIndicators: buildRiskIndicators({ type: 'ip', ipQualityScore }),
    recommendations: buildRecommendations(riskLevel, 'ip'),
    finalVerdict,
    details: { virusTotal, abuseIPDB, ipQualityScore },
    warnings,
    timestamp: new Date().toISOString()
  };
}

/**
 * Runs a full analysis for an uploaded file using VirusTotal's file
 * scanning engine (SHA256 lookup + upload/poll fallback).
 */
async function analyzeFile({ buffer, originalName, size, extension }) {
  const { warnings } = buildProviderWarnings();

  const virusTotal = await virusTotalService.analyzeFile(buffer, originalName);

  const { riskScore, confidence } = calculateRiskScore({ virusTotal });
  const riskLevel = getRiskLevel(riskScore);
  const finalVerdict = getFinalVerdict(riskScore);

  return {
    scanId: generateScanId(),
    target: originalName,
    type: 'file',
    fileName: originalName,
    fileType: extension,
    fileSize: size,
    sha256: virusTotal.sha256 || null,
    riskScore,
    riskLevel,
    confidence,
    detectionRatio: buildDetectionRatio(virusTotal),
    summary: buildFileSummary({ virusTotal }),
    findings: buildFileFindings({ virusTotal }),
    riskIndicators: buildFileRiskIndicators({ fileType: extension }),
    recommendations: buildRecommendations(riskLevel, 'file'),
    finalVerdict,
    details: { virusTotal },
    warnings,
    timestamp: new Date().toISOString()
  };
}

module.exports = { analyzeUrl, analyzeIp, analyzeFile };
