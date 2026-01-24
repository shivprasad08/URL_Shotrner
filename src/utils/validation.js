/**
 * Validation Utilities
 * Custom validators for URL shortener business logic
 */

const { body, validationResult } = require('express-validator');

/**
 * Validate and sanitize URL
 * @returns {Array} Array of express-validator middleware
 */
const validateUrl = () => {
  return [
    body('url')
      .trim()
      .notEmpty()
      .withMessage('URL is required')
      .isURL({ require_protocol: true, require_tld: true })
      .withMessage('Invalid URL format. Must be a valid HTTP/HTTPS URL')
      .isLength({ max: 2048 })
      .withMessage('URL is too long. Maximum length is 2048 characters'),
  ];
};

/**
 * Validate short code format
 * @returns {Array} Array of express-validator middleware
 */
const validateShortCode = () => {
  return [
    body('shortCode')
      .optional()
      .trim()
      .matches(/^[a-zA-Z0-9]{3,10}$/)
      .withMessage('Short code must be 3-10 alphanumeric characters'),
  ];
};

/**
 * Middleware to check validation results
 * @param {Object} req Express request object
 * @param {Object} res Express response object
 * @param {Function} next Express next middleware function
 * @returns {void}
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array().map(err => ({
        field: err.param,
        message: err.msg,
      })),
    });
  }
  next();
};

/**
 * Validate short code exists in params
 * @returns {Array} Array of express-validator middleware
 */
const validateShortCodeParam = () => {
  return [
    body('shortCode', 'Short code is required').notEmpty(),
  ];
};

module.exports = {
  validateUrl,
  validateShortCode,
  validateShortCodeParam,
  handleValidationErrors,
  validationResult,
};
