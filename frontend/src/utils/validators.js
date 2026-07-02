// Client-side validation helpers for instant, friendly feedback
// before the request is sent to the backend.

export function isValidURL(value) {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (err) {
    return false;
  }
}

export function isValidIPv4(value) {
  const ipv4Regex =
    /^(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}$/;
  return ipv4Regex.test(value);
}

export function isValidIPv6(value) {
  const ipv6Regex =
    /^((?:[0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4}|(?:[0-9A-Fa-f]{1,4}:){1,7}:|(?:[0-9A-Fa-f]{1,4}:){1,6}:[0-9A-Fa-f]{1,4}|(?:[0-9A-Fa-f]{1,4}:){1,5}(:[0-9A-Fa-f]{1,4}){1,2}|(?:[0-9A-Fa-f]{1,4}:){1,4}(:[0-9A-Fa-f]{1,4}){1,3}|(?:[0-9A-Fa-f]{1,4}:){1,3}(:[0-9A-Fa-f]{1,4}){1,4}|(?:[0-9A-Fa-f]{1,4}:){1,2}(:[0-9A-Fa-f]{1,4}){1,5}|[0-9A-Fa-f]{1,4}:((:[0-9A-Fa-f]{1,4}){1,6})|:((:[0-9A-Fa-f]{1,4}){1,7}|:))$/;
  return ipv6Regex.test(value);
}

export function isValidIP(value) {
  if (!value) return false;
  return isValidIPv4(value) || isValidIPv6(value);
}

// Mirrors backend/config/config.js fileUpload settings.
export const ALLOWED_FILE_EXTENSIONS = ['pdf', 'doc', 'docx', 'zip', 'exe', 'apk', 'png', 'jpg', 'jpeg'];
export const MAX_FILE_SIZE_BYTES = 32 * 1024 * 1024; // 32 MB

export function isAllowedFileType(fileName) {
  if (!fileName) return false;
  const extension = fileName.split('.').pop().toLowerCase();
  return ALLOWED_FILE_EXTENSIONS.includes(extension);
}

export function isValidFileSize(sizeInBytes) {
  return sizeInBytes > 0 && sizeInBytes <= MAX_FILE_SIZE_BYTES;
}

export function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
