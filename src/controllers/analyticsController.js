/**
 * Analytics Controller
 * Handles HTTP requests for analytics and metrics
 */

const analyticsService = require('../services/analyticsService');
const urlService = require('../services/urlService');
const logger = require('../utils/logger');
const { NotFoundError } = require('../utils/errors');

/**
 * GET /api/analytics/:shortCode
 * Get detailed analytics for a specific short URL (verify ownership)
 */
async function getUrlAnalytics(req, res, next) {
  try {
    const { shortCode } = req.params;

    logger.debug('Analytics request received', { shortCode, userId: req.user?.id });

    const analytics = await analyticsService.getDetailedAnalytics(shortCode, req.user.id);

    if (!analytics) {
      throw new NotFoundError('Short URL not found or you do not have permission to view its analytics');
    }

    res.json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/analytics
 * Get user analytics (only their URLs)
 */
async function getSystemAnalytics(req, res, next) {
  try {
    logger.debug('User analytics request received', { userId: req.user?.id });

    const analytics = await analyticsService.getSystemAnalytics(req.user.id);

    res.json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/analytics/trends/:days
 * Get usage trends over time
 */
async function getUsageTrends(req, res, next) {
  try {
    const days = Math.min(365, parseInt(req.params.days || '30', 10));

    logger.debug('Usage trends request received', { days });

    const trends = await analyticsService.getUsageTrends(days);

    res.json({
      success: true,
      data: trends,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getUrlAnalytics,
  getSystemAnalytics,
  getUsageTrends,
};
