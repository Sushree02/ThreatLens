/**
 * ThreatLens Risk Scoring Engine (v2)
 * ---------------------------------
 * Combines results from multiple threat intelligence sources into a
 * single, easy to understand risk score (0-100), risk level, and
 * confidence score. Designed to degrade gracefully when one or more
 * providers are not configured / did not return data.
 *
 * VirusTotal risk is derived from malicious detection COUNT bands
 * (more realistic than a raw ratio against total engines):
 *   0 detections        -> 0-10
 *   1-3 detections       -> 20-40
 *   4-10 detections       -> 50-70
 *   11+ detections        -> 80-100
 *
 * Confidence score is based on how many providers returned data:
 *   1 provider active  -> 60%
 *   2 providers active -> 80%
 *   3 providers active -> 95%
 *   0 providers active -> 30% (fallback)
 */

const CONFIDENCE_BY_PROVIDER_COUNT = { 0: 30, 1: 60, 2: 80, 3: 95 };

/**
 * Maps a VirusTotal malicious detection count to a 0-100 risk score
 * using realistic detection bands instead of a raw ratio.
 */
function scoreFromDetectionCount(malicious) {
  const m = malicious || 0;
  if (m <= 0) return 5; // midpoint of 0-10
  if (m <= 3) return Math.round(20 + ((m - 1) / 2) * 20); // 1->20 .. 3->40
  if (m <= 10) return Math.round(50 + ((m - 4) / 6) * 20); // 4->50 .. 10->70
  const capped = Math.min(m, 30);
  return Math.round(80 + ((capped - 11) / 19) * 20); // 11->80 .. 30->100
}

/**
 * Normalizes VirusTotal malicious detection counts into a
 * 0-100 risk contribution (higher = riskier).
 */
function scoreFromVirusTotal(vt) {
  if (!vt || vt.available === false) return null;
  return scoreFromDetectionCount(vt.malicious || 0);
}

/**
 * AbuseIPDB already returns an abuseConfidenceScore (0-100),
 * which we can use directly as a risk contribution.
 */
function scoreFromAbuseIPDB(abuse) {
  if (!abuse || abuse.available === false) return null;
  return Math.min(Math.max(abuse.abuseConfidenceScore || 0, 0), 100);
}

/**
 * IPQualityScore returns a fraud/risk score (0-100) directly usable.
 */
function scoreFromIPQualityScore(ipqs) {
  if (!ipqs || ipqs.available === false) return null;
  return Math.min(Math.max(ipqs.riskScore || 0, 0), 100);
}

/**
 * Combines all available provider sub-scores (VirusTotal, AbuseIPDB,
 * IPQualityScore) into a single risk score using a simple average of
 * whichever providers actually returned data. SSL/HTTPS status is
 * shown as a finding but is intentionally NOT part of the score, to
 * keep the engine's math transparent and realistic.
 */
function calculateRiskScore({ virusTotal, abuseIPDB, ipQualityScore }) {
  const contributions = [
    { key: 'virusTotal', value: scoreFromVirusTotal(virusTotal) },
    { key: 'abuseIPDB', value: scoreFromAbuseIPDB(abuseIPDB) },
    { key: 'ipQualityScore', value: scoreFromIPQualityScore(ipQualityScore) }
  ].filter((c) => c.value !== null);

  const providerCount = contributions.length;
  const confidence = CONFIDENCE_BY_PROVIDER_COUNT[Math.min(providerCount, 3)];

  if (providerCount === 0) {
    return { riskScore: 0, confidence, usedFactors: [], detectionRatio: null };
  }

  const average = contributions.reduce((sum, c) => sum + c.value, 0) / providerCount;
  const riskScore = Math.round(average);

  return {
    riskScore: Math.min(Math.max(riskScore, 0), 100),
    confidence,
    usedFactors: contributions.map((c) => c.key)
  };
}

/**
 * Maps a numeric risk score to a human-readable risk level.
 *   0-20   -> Safe
 *   21-50  -> Moderate Risk
 *   51-100 -> High Risk
 */
function getRiskLevel(score) {
  if (score <= 20) return 'Safe';
  if (score <= 50) return 'Moderate Risk';
  return 'High Risk';
}

/**
 * Maps a numeric risk score to one of four descriptive final verdicts.
 * These are intentionally a bit finer-grained than the 3 risk levels
 * so the report reads naturally to a non-technical user.
 */
function getFinalVerdict(score) {
  if (score <= 20) return 'Safe To Visit';
  if (score <= 40) return 'Proceed With Caution';
  if (score <= 70) return 'Potentially Malicious';
  return 'High-Risk Website';
}

module.exports = {
  calculateRiskScore,
  getRiskLevel,
  getFinalVerdict,
  scoreFromDetectionCount
};
