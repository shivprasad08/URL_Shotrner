/**
 * URL Controller
 * Handles HTTP requests for URL shortening and retrieval
 */

const urlService = require('../services/urlService');
const logger = require('../utils/logger');
const { NotFoundError, BadRequestError } = require('../utils/errors');

/**
 * POST /api/shorten
 * Create a new shortened URL
 */
async function shortenUrl(req, res, next) {
  try {
    const { url, customCode, description, expiresAt } = req.body;

    // Additional validation
    if (!url) {
      throw new BadRequestError('URL is required');
    }

    // Parse and validate date if provided
    let expiration = null;
    if (expiresAt) {
      expiration = new Date(expiresAt);
      if (isNaN(expiration.getTime())) {
        throw new BadRequestError('Invalid expiration date format');
      }
      if (expiration <= new Date()) {
        throw new BadRequestError('Expiration date must be in the future');
      }
    }

    logger.debug('Processing shorten URL request', {
      urlPreview: url.substring(0, 50),
      hasCustomCode: !!customCode,
    });

    const result = await urlService.createShortUrl(url, {
      customCode,
      description,
      expiresAt: expiration,
      createdBy: req.ip,
      userId: req.user?.id || null,
    });

    const shortUrl = `${process.env.APP_URL || 'http://localhost:3000'}/${result.shortCode}`;

    logger.info('Short URL created via API', {
      shortCode: result.shortCode,
      originalUrl: url.substring(0, 50),
    });

    res.status(201).json({
      success: true,
      data: {
        shortCode: result.shortCode,
        shortUrl,
        originalUrl: result.originalUrl,
        createdAt: result.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /:shortCode
 * Redirect to original URL and track analytics
 */
async function redirectUrl(req, res, next) {
  try {
    const { shortCode } = req.params;

    logger.debug('Redirect request received', { shortCode });

    const urlMapping = await urlService.getAndTrackUrl(shortCode, {
      userAgent: req.get('user-agent'),
      ipAddress: req.ip,
      referer: req.get('referer'),
    });

    logger.info('URL redirected', {
      shortCode,
      originalUrl: urlMapping.originalUrl.substring(0, 50),
      clickCount: urlMapping.clickCount + 1,
    });

    // Use 301 (permanent) or 302 (temporary) redirect
    // Using 302 for dynamic analytics tracking
    res.redirect(302, urlMapping.originalUrl);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/urls
 * Get all shortened URLs (paginated)
 */
async function getAllUrls(req, res, next) {
  try {
    const page = parseInt(req.query.page || '1', 10);
    const limit = parseInt(req.query.limit || '20', 10);

    logger.debug('Fetching all URLs', { page, limit });

    const result = await urlService.getAllUrls({
      page,
      limit,
      activeOnly: req.query.activeOnly !== 'false',
    });

    res.json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/urls/my-urls
 * Get URLs for logged in user
 */
async function getMyUrls(req, res, next) {
  try {
    const page = parseInt(req.query.page || '1', 10);
    const limit = parseInt(req.query.limit || '50', 10);
    const skip = (page - 1) * limit;

    const [urls, total] = await Promise.all([
      require('../models/URLMapping')
        .find({ userId: req.user.id, isActive: true })
        .select('shortCode originalUrl description clickCount createdAt isActive')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      require('../models/URLMapping').countDocuments({ userId: req.user.id, isActive: true }),
    ]);

    res.json({
      success: true,
      data: urls,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/urls/:shortCode
 * Deactivate a shortened URL
 */
async function deleteUrl(req, res, next) {
  try {
    const { shortCode } = req.params;

    logger.debug('Delete request received', { shortCode, userId: req.user?.id });

    const result = await urlService.deleteShortUrl(shortCode, req.user.id);

    logger.info('Short URL deleted', { shortCode });

    res.json({
      success: true,
      message: 'Short URL deleted successfully',
      data: {
        shortCode: result.shortCode,
        deletedAt: result.deletedAt,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/reset (DEV ONLY)
 * Clear all URLs from database for testing
 */
async function resetDatabase(req, res, next) {
  try {
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({
        success: false,
        error: 'Reset not allowed in production'
      });
    }
    
    const URLMapping = require('../models/URLMapping');
    const result = await URLMapping.deleteMany({});
    
    console.log('🗑️  Database cleared:', result);
    
    res.json({
      success: true,
      message: 'Database cleared',
      deletedCount: result.deletedCount
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  shortenUrl,
  redirectUrl,
  getAllUrls,
  getMyUrls,
  deleteUrl,
  resetDatabase,
};
