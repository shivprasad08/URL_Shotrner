/**
 * URL Routes
 * Routes for URL shortening and retrieval
 */

const express = require('express');
const router = express.Router();

const urlController = require('../controllers/urlController');
const { validateUrl, handleValidationErrors } = require('../utils/validation');
const { asyncHandler } = require('../middlewares/errorHandler');

/**
 * POST /api/shorten
 * Create a new shortened URL
 */
router.post(
  '/shorten',
  validateUrl(),
  handleValidationErrors,
  asyncHandler(urlController.shortenUrl)
);

/**
 * GET /api/urls
 * Get all shortened URLs (paginated)
 */
router.get('/urls', asyncHandler(urlController.getAllUrls));

/**
 * DELETE /api/urls/:shortCode
 * Deactivate a shortened URL
 */
router.delete('/urls/:shortCode', asyncHandler(urlController.deleteUrl));

module.exports = router;
