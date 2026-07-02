/**
 * Generates human-readable, structured report content based on the
 * analysis data collected for a URL, IP address, or File.
 *
 * Output is split into distinct sections so the UI and PDF can
 * present a clean "Threat Intelligence Summary / Threat Findings /
 * Risk Indicators / Recommendations / Final Verdict" report instead
 * of one long technical list.
 */

/**
 * Threat Intelligence Summary: a short, plain-language description
 * of which engines/providers scanned the target.
 */
function buildSummary({ type, virusTotal, abuseIPDB, ipQualityScore }) {
  const lines = [];

  if (virusTotal && virusTotal.available) {
    lines.push(`VirusTotal scanned using ${virusTotal.totalEngines} security engine(s).`);
  } else {
    lines.push('VirusTotal data was not available for this scan.');
  }

  if (type === 'ip') {
    if (abuseIPDB && abuseIPDB.available) {
      lines.push(`AbuseIPDB found ${abuseIPDB.totalReports} abuse report(s) for this IP.`);
    } else {
      lines.push('AbuseIPDB data was not available for this scan.');
    }
  }

  if ((type === 'ip' || type === 'url') && ipQualityScore && ipQualityScore.available) {
    lines.push(`IPQualityScore assigned a fraud/risk score of ${ipQualityScore.riskScore}/100.`);
  }

  return lines;
}

/**
 * Threat Findings: concrete detection numbers.
 */
function buildThreatFindings({ type, virusTotal, abuseIPDB }) {
  const findings = [];

  if (virusTotal && virusTotal.available) {
    findings.push(`${virusTotal.malicious} engine(s) flagged this as malicious.`);
    findings.push(`${virusTotal.suspicious} engine(s) flagged this as suspicious.`);
  }

  if (type === 'ip' && abuseIPDB && abuseIPDB.available) {
    findings.push(`Abuse confidence score: ${abuseIPDB.abuseConfidenceScore}/100.`);
  }

  if (findings.length === 0) {
    findings.push('No detection data was available from the configured providers.');
  }

  return findings;
}

/**
 * Risk Indicators: contextual signals (domain age, SSL, proxy/VPN/Tor, etc.)
 */
function buildRiskIndicators({ type, sslInfo, domainInfo, ipQualityScore }) {
  const indicators = [];

  if (type === 'url') {
    if (sslInfo) {
      indicators.push(
        sslInfo.httpsEnabled ? 'Site uses HTTPS.' : 'Site does not use HTTPS (unencrypted traffic).'
      );
      if (sslInfo.httpsEnabled && !sslInfo.sslValid) {
        indicators.push('SSL certificate could not be verified as valid.');
      }
    }
    if (domainInfo && domainInfo.ageInDays !== null && domainInfo.ageInDays !== undefined) {
      if (domainInfo.ageInDays < 180) {
        indicators.push('Newly registered domain (under 6 months old).');
      }
    }
  }

  if (type === 'ip' && ipQualityScore && ipQualityScore.available) {
    if (ipQualityScore.isProxy) indicators.push('IP appears to be a proxy.');
    if (ipQualityScore.isVpn) indicators.push('IP appears to be associated with a VPN.');
    if (ipQualityScore.isTor) indicators.push('IP appears to be a Tor exit node.');
    if (ipQualityScore.recentAbuse) indicators.push('IP has recent abuse reports.');
  }

  if (indicators.length === 0) {
    indicators.push('No additional risk indicators were detected.');
  }

  return indicators;
}

/**
 * File-specific findings, used instead of the URL/IP builders above
 * when analyzing an uploaded file.
 */
function buildFileFindings({ virusTotal }) {
  const findings = [];
  if (virusTotal && virusTotal.available) {
    findings.push(`${virusTotal.malicious} engine(s) flagged this file as malicious.`);
    findings.push(`${virusTotal.suspicious} engine(s) flagged this file as suspicious.`);
  } else {
    findings.push('No detection data was available for this file.');
  }
  return findings;
}

function buildFileSummary({ virusTotal }) {
  if (virusTotal && virusTotal.available) {
    return [`VirusTotal scanned this file using ${virusTotal.totalEngines} security engine(s).`];
  }
  return ['VirusTotal data was not available for this file.'];
}

function buildFileRiskIndicators({ fileType }) {
  const highRiskExtensions = ['exe', 'apk'];
  const indicators = [];
  if (fileType && highRiskExtensions.includes(fileType.toLowerCase())) {
    indicators.push(`File type ".${fileType}" is an executable format commonly used to distribute malware.`);
  } else {
    indicators.push('File type does not fall into a commonly high-risk executable category.');
  }
  return indicators;
}

/**
 * Recommendations, tailored by risk level and target type.
 */
function buildRecommendations(riskLevel, type = 'url') {
  const base = [
    'Verify the ownership and legitimacy of the source before trusting it.',
    'Use official and well-known sources whenever possible.'
  ];

  const fileAdvice = type === 'file';

  if (riskLevel === 'Safe') {
    return [
      ...base,
      'No major threats detected, but always stay cautious.',
      fileAdvice
        ? 'Still scan the file with your local antivirus before opening it.'
        : 'Keep your browser and antivirus software up to date.'
    ];
  }

  if (riskLevel === 'Moderate Risk') {
    return [
      ...base,
      fileAdvice
        ? 'Avoid opening or executing this file until verified.'
        : 'Avoid entering passwords or sensitive information.',
      fileAdvice
        ? 'Scan the file again with an updated antivirus tool.'
        : 'Do not download files from this source unless verified.'
    ];
  }

  // High Risk
  return [
    ...base,
    fileAdvice ? 'Do not open, run, or share this file.' : 'Avoid entering passwords or any personal information.',
    fileAdvice ? 'Delete the file and scan your device for infection.' : 'Do not download or execute files from this source.',
    "Report this to your organization's security team if encountered at work."
  ];
}

module.exports = {
  buildSummary,
  buildThreatFindings,
  buildRiskIndicators,
  buildFileFindings,
  buildFileSummary,
  buildFileRiskIndicators,
  buildRecommendations
};
