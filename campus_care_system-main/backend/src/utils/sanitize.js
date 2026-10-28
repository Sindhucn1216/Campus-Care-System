export function trimToNull(value) {
  if (value === undefined || value === null) return null;
  const text = String(value).trim();
  return text === '' ? null : text;
}

export function requireString(value, field, { min = 1, max = 255 } = {}) {
  const text = trimToNull(value);
  if (!text) {
    const err = new Error(`${field} is required.`);
    err.status = 400;
    throw err;
  }
  if (text.length < min) {
    const err = new Error(`${field} must be at least ${min} characters.`);
    err.status = 400;
    throw err;
  }
  if (text.length > max) {
    const err = new Error(`${field} must be at most ${max} characters.`);
    err.status = 400;
    throw err;
  }
  return text;
}

export function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function normalizeEmail(value) {
  return String(value || '').trim().toLowerCase();
}
