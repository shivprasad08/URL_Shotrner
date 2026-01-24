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
 * Get detailed analytics for a specific short URL
 */
async function getUrlAnalytics(req, res, next) {
  try {
    const { shortCode } = req.params;

    logger.debug('Analytics request received', { shortCode });

    const analytics = await analyticsService.getDetailedAnalytics(shortCode);

    if (!analytics) {
      throw new NotFoundError('Short URL not found');
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
 * Get system-wide analytics
 */
async function getSystemAnalytics(req, res, next) {
  try {
    logger.debug('System analytics request received');

    const analytics = await analyticsService.getSystemAnalytics();

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
