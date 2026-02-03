/**
 * Analytics Service
 * Aggregates and provides analytics insights
 */

const URLMapping = require('../models/URLMapping');
const logger = require('../utils/logger');

/**
 * Get user analytics (only their URLs)
 * @param {string} userId - User ID to filter by
 * @returns {Object} User analytics
 */
async function getSystemAnalytics(userId) {
  try {
    const mongoose = require('mongoose');
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const query = { isActive: true, userId: userObjectId };
    
    const [totalUrls, totalClicks, mostPopular, recentUrls] = await Promise.all([
      URLMapping.countDocuments(query),
      URLMapping.aggregate([
        { $match: query },
        { $group: { _id: null, totalClicks: { $sum: '$clickCount' } } },
      ]),
      URLMapping.find(query)
        .select('shortCode originalUrl clickCount')
        .sort({ clickCount: -1 })
        .limit(10),
      URLMapping.find(query)
        .select('shortCode originalUrl createdAt clickCount')
        .sort({ createdAt: -1 })
        .limit(10),
    ]);

    const totalClicksCount = totalClicks[0]?.totalClicks || 0;
    const avgClicks = totalUrls > 0 ? totalClicksCount / totalUrls : 0;

    return {
      totalURLs: totalUrls,
      totalClicks: totalClicksCount,
      avgClicksPerURL: avgClicks,
      activeURLs: totalUrls,
      topURLs: mostPopular,
      recentUrls,
      timestamp: new Date(),
    };
  } catch (error) {
    logger.error('Failed to fetch user analytics', { error: error.message });
    throw error;
  }
}

/**
 * Get usage trends over time
 * @param {number} days - Number of days to analyze
 * @returns {Object} Trend data
 */
async function getUsageTrends(days = 30) {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const trends = await URLMapping.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          isActive: true,
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          count: { $sum: 1 },
          totalClicks: { $sum: '$clickCount' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return {
      period: `${days} days`,
      startDate,
      trends,
    };
  } catch (error) {
    logger.error('Failed to fetch usage trends', { error: error.message });
    throw error;
  }
}

/**
 * Get detailed URL analytics with full access logs
 * @param {string} shortCode - The short code
 * @param {string} userId - User ID to verify ownership
 * @param {number} limit - Maximum number of access logs to return
 * @returns {Object} Detailed analytics
 */
async function getDetailedAnalytics(shortCode, userId, limit = 100) {
  try {
    const mongoose = require('mongoose');
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const urlMapping = await URLMapping.findOne({ shortCode, isActive: true, userId: userObjectId });

    if (!urlMapping) {
      return null;
    }

    const recentAccesses = urlMapping.analytics.slice(-limit);

    return {
      shortCode,
      originalUrl: urlMapping.originalUrl,
      stats: {
        totalClicks: urlMapping.clickCount,
        lastAccessedAt: urlMapping.lastAccessedAt,
        createdAt: urlMapping.createdAt,
        daysOld: Math.floor((new Date() - urlMapping.createdAt) / (1000 * 60 * 60 * 24)),
        avgClicksPerDay:
          (urlMapping.clickCount /
            Math.max(
              1,
              Math.floor((new Date() - urlMapping.createdAt) / (1000 * 60 * 60 * 24))
            )) ||
          0,
      },
      recentAccesses,
      summary: {
        uniqueUserAgents: new Set(urlMapping.analytics.map(a => a.userAgent)).size,
        uniqueIpAddresses: new Set(urlMapping.analytics.map(a => a.ipAddress)).size,
      },
    };
  } catch (error) {
    logger.error('Failed to fetch detailed analytics', { error: error.message, shortCode });
    throw error;
  }
}

module.exports = {
  getSystemAnalytics,
  getUsageTrends,
  getDetailedAnalytics,
};
