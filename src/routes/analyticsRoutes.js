/**
 * Analytics Routes
 * Routes for analytics and metrics
 */

const express = require('express');
const router = express.Router();

const analyticsController = require('../controllers/analyticsController');
const { asyncHandler } = require('../middlewares/errorHandler');

/**
 * GET /api/analytics
 * Get system-wide analytics
 */
router.get('/', asyncHandler(analyticsController.getSystemAnalytics));

/**
 * GET /api/analytics/:shortCode
 * Get detailed analytics for a specific short URL
 */
router.get('/:shortCode', asyncHandler(analyticsController.getUrlAnalytics));

/**
 * GET /api/analytics/trends/:days
 * Get usage trends over time
 */
router.get('/trends/:days', asyncHandler(analyticsController.getUsageTrends));

module.exports = router;
