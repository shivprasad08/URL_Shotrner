/**
 * Short Code Generator Utility
 * Generates unique, collision-resistant short codes
 */

const crypto = require('crypto');
const config = require('../config/environment');

/**
 * Generate a random short code
 * @param {number} length Length of short code
 * @returns {string} Random short code
 */
const generateShortCode = (length = config.shortCodeLength) => {
  const charset = config.shortCodeCharset;
  let shortCode = '';

  // Use crypto for better randomness
  const randomBytes = crypto.randomBytes(length);
  for (let i = 0; i < length; i++) {
    shortCode += charset[randomBytes[i] % charset.length];
  }

  return config.shortCodePrefix + shortCode;
};

/**
 * Generate short code from URL hash
 * Useful for deterministic short codes
 * @param {string} url The URL to hash
 * @param {number} length Length of short code
 * @returns {string} Hash-based short code
 */
const generateShortCodeFromUrl = (url, length = config.shortCodeLength) => {
  const hash = crypto.createHash('sha256').update(url).digest('hex');
  const charset = config.shortCodeCharset;
  let shortCode = '';

  for (let i = 0; i < length; i++) {
    const charIndex = parseInt(hash.substr(i * 2, 2), 16) % charset.length;
    shortCode += charset[charIndex];
  }

  return config.shortCodePrefix + shortCode;
};

/**
 * Validate short code format
 * @param {string} shortCode The short code to validate
 * @returns {boolean} True if valid
 */
const isValidShortCode = (shortCode) => {
  const regex = new RegExp(`^${config.shortCodePrefix}[a-zA-Z0-9]{${config.shortCodeLength}}$`);
  return regex.test(shortCode);
};

module.exports = {
  generateShortCode,
  generateShortCodeFromUrl,
  isValidShortCode,
};
