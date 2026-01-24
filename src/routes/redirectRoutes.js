/**
 * Redirect Routes
 * Routes for short URL redirection
 */

const express = require('express');
const router = express.Router();

const urlController = require('../controllers/urlController');
const { asyncHandler } = require('../middlewares/errorHandler');

/**
 * GET /:shortCode
 * Redirect to original URL and track analytics
 */
router.get('/:shortCode', asyncHandler(urlController.redirectUrl));

module.exports = router;
