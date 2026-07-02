// Validation helpers for URLs and IP addresses (IPv4 + IPv6)

/**
 * Validates a URL string. Accepts http:// and https:// URLs.
 */
function isValidURL(value) {
  if (!value || typeof value !== 'string') return false;
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (err) {
    return false;
  }
}

/**
 * Validates an IPv4 address, e.g. 192.168.1.1
 */
function isValidIPv4(value) {
  const ipv4Regex =
    /^(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}$/;
  return ipv4Regex.test(value);
}

/**
 * Validates an IPv6 address, e.g. 2001:0db8:85a3::8a2e:0370:7334
 */
function isValidIPv6(value) {
  const ipv6Regex =
    /^((?:[0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4}|(?:[0-9A-Fa-f]{1,4}:){1,7}:|(?:[0-9A-Fa-f]{1,4}:){1,6}:[0-9A-Fa-f]{1,4}|(?:[0-9A-Fa-f]{1,4}:){1,5}(:[0-9A-Fa-f]{1,4}){1,2}|(?:[0-9A-Fa-f]{1,4}:){1,4}(:[0-9A-Fa-f]{1,4}){1,3}|(?:[0-9A-Fa-f]{1,4}:){1,3}(:[0-9A-Fa-f]{1,4}){1,4}|(?:[0-9A-Fa-f]{1,4}:){1,2}(:[0-9A-Fa-f]{1,4}){1,5}|[0-9A-Fa-f]{1,4}:((:[0-9A-Fa-f]{1,4}){1,6})|:((:[0-9A-Fa-f]{1,4}){1,7}|:))$/;
  return ipv6Regex.test(value);
}

function isValidIP(value) {
  if (!value || typeof value !== 'string') return false;
  return isValidIPv4(value) || isValidIPv6(value);
}

/**
 * Extracts the hostname/domain from a full URL.
 */
function extractDomain(urlString) {
  try {
    const url = new URL(urlString);
    return url.hostname;
  } catch (err) {
    return null;
  }
}

module.exports = {
  isValidURL,
  isValidIPv4,
  isValidIPv6,
  isValidIP,
  extractDomain
};
