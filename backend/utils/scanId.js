// Generates a short, human-readable unique scan ID for report tracking,
// e.g. "TL-LX2K9F-A3C1". No external uuid dependency required.

const crypto = require('crypto');

function generateScanId() {
  const timePart = Date.now().toString(36).toUpperCase();
  const randomPart = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `TL-${timePart}-${randomPart}`;
}

module.exports = { generateScanId };
