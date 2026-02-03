/**
 * URL Routes
 * Routes for URL shortening and retrieval
 */

const express = require('express');
const router = express.Router();

const urlController = require('../controllers/urlController');
const { validateUrl, handleValidationErrors } = require('../utils/validation');
const { asyncHandler } = require('../middlewares/errorHandler');
const { authMiddleware } = require('../middlewares/authMiddleware');

/**
 * POST /api/shorten
 * Create a new shortened URL
 */
router.post(
  '/shorten',
  authMiddleware,
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
 * GET /api/urls/my-urls
 * Get URLs belonging to the authenticated user
 */
router.get('/urls/my-urls', authMiddleware, asyncHandler(urlController.getMyUrls));

/**
 * DELETE /api/urls/:shortCode
 * Deactivate a shortened URL
 */
router.delete('/urls/:shortCode', authMiddleware, asyncHandler(urlController.deleteUrl));

/**
 * DELETE /api/reset
 * Clear database (dev only)
 */
router.delete('/reset', asyncHandler(urlController.resetDatabase));

module.exports = router;
