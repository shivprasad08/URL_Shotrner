/**
 * URL Service
 * Business logic for URL shortening and management
 */

const URLMapping = require('../models/URLMapping');
const logger = require('../utils/logger');
const { generateShortCode } = require('../utils/shortCodeGenerator');
const { NotFoundError, ConflictError, BadRequestError } = require('../utils/errors');
const mongoose = require('mongoose');

/**
 * Create a new shortened URL
 * @param {string} originalUrl - The original long URL
 * @param {Object} options - Optional configuration
 * @param {string} options.customCode - Optional custom short code
 * @param {string} options.description - Optional description
 * @param {Date} options.expiresAt - Optional expiration date
 * @param {string} options.createdBy - Optional user identifier
 * @param {string} options.userId - Optional owner user id
 * @returns {Object} Created URL mapping
 */
async function createShortUrl(originalUrl, options = {}) {
  try {
    // Normalize URL
    const normalizedUrl = originalUrl.toLowerCase().trim();

    // Check if URL already has a short code
    const existing = await URLMapping.findOne(
      { originalUrl: normalizedUrl, isActive: true },
      { shortCode: 1, createdAt: 1 }
    );

    if (existing) {
      logger.info('Duplicate URL found, returning existing short code', {
        originalUrl: normalizedUrl.substring(0, 50),
        shortCode: existing.shortCode,
      });
      return existing;
    }

    let shortCode = options.customCode;

    // Validate custom code if provided
    if (shortCode) {
      const existingCustom = await URLMapping.findOne({ shortCode, isActive: true });
      if (existingCustom) {
        logger.warn('Custom short code already exists', { shortCode });
        throw new ConflictError(`Short code "${shortCode}" is already in use`);
      }
    } else {
      // Generate unique short code with retry mechanism
      shortCode = await generateUniqueShortCode(10); // Max 10 retries
    }

    // Create new URL mapping
    const urlMapping = new URLMapping({
      originalUrl: normalizedUrl,
      shortCode,
      description: options.description || null,
      expiresAt: options.expiresAt || null,
      createdBy: options.createdBy || null,
      userId: options.userId || null,
      isActive: true,
    });

    await urlMapping.save();

    logger.info('Short URL created successfully', {
      shortCode,
      originalUrl: normalizedUrl.substring(0, 100),
    });

    return urlMapping;
  } catch (error) {
    if (error.name === 'MongoServerError' && error.code === 11000) {
      logger.warn('Duplicate short code generated', { error: error.message });
      throw new ConflictError('Unable to generate unique short code. Please try again.');
    }
    throw error;
  }
}

/**
 * Generate a unique short code with collision handling
 * @param {number} maxRetries - Maximum number of retries
 * @returns {string} Unique short code
 */
async function generateUniqueShortCode(maxRetries = 10) {
  for (let i = 0; i < maxRetries; i++) {
    const code = generateShortCode();
    const existing = await URLMapping.findOne({ shortCode: code });
    if (!existing) {
      return code;
    }
    logger.debug('Short code collision detected, retrying', { attempt: i + 1 });
  }
  throw new Error('Failed to generate unique short code after maximum retries');
}

/**
 * Get original URL by short code and record access
 * @param {string} shortCode - The short code
 * @param {Object} accessData - Access metadata
 * @param {string} accessData.userAgent - Request user agent
 * @param {string} accessData.ipAddress - Request IP address
 * @param {string} accessData.referer - Request referer
 * @returns {Object} URL mapping with original URL
 */
async function getAndTrackUrl(shortCode, accessData = {}) {
  const urlMapping = await URLMapping.findActiveByShortCode(shortCode);

  if (!urlMapping) {
    logger.warn('Short code not found or expired', { shortCode });
    throw new NotFoundError('Short URL not found or has expired');
  }

  // Check if expired
  if (urlMapping.isExpired()) {
    logger.warn('Short code has expired', { shortCode });
    throw new NotFoundError('Short URL has expired');
  }

  // Record access asynchronously (non-blocking)
  recordUrlAccess(urlMapping, accessData).catch(error => {
    logger.error('Failed to record URL access', { error: error.message, shortCode });
  });

  return urlMapping;
}

/**
 * Record URL access (async, non-blocking)
 * @param {Object} urlMapping - The URL mapping object
 * @param {Object} accessData - Access metadata
 */
async function recordUrlAccess(urlMapping, accessData = {}) {
  try {
    // Use atomic operation to increment click count
    await URLMapping.updateOne(
      { _id: urlMapping._id },
      {
        $inc: { clickCount: 1 },
        $set: { lastAccessedAt: new Date() },
        $push: {
          analytics: {
            timestamp: new Date(),
            userAgent: accessData.userAgent || 'Unknown',
            ipAddress: accessData.ipAddress || 'Unknown',
            referer: accessData.referer || null,
          },
        },
      }
    );

    logger.debug('URL access recorded', {
      shortCode: urlMapping.shortCode,
      totalClicks: urlMapping.clickCount + 1,
    });
  } catch (error) {
    logger.error('Failed to record URL access', { error: error.message });
  }
}

/**
 * Get analytics for a short URL
 * @param {string} shortCode - The short code
 * @returns {Object} Analytics data
 */
async function getAnalytics(shortCode) {
  const urlMapping = await URLMapping.findOne({ shortCode, isActive: true });

  if (!urlMapping) {
    throw new NotFoundError('Short URL not found');
  }

  return {
    shortCode,
    originalUrl: urlMapping.originalUrl,
    totalClicks: urlMapping.clickCount,
    lastAccessedAt: urlMapping.lastAccessedAt,
    createdAt: urlMapping.createdAt,
    expiresAt: urlMapping.expiresAt,
    isExpired: urlMapping.isExpired(),
    recentAccesses: urlMapping.analytics.slice(-20),
    topUserAgents: getTopItems(urlMapping.analytics, 'userAgent', 5),
    topIpAddresses: getTopItems(urlMapping.analytics, 'ipAddress', 5),
  };
}

/**
 * Get top N items from analytics array
 * @param {Array} analytics - Analytics array
 * @param {string} field - Field to analyze
 * @param {number} limit - Number of top items
 * @returns {Array} Top items with counts
 */
function getTopItems(analytics, field, limit) {
  const counts = {};
  analytics.forEach(entry => {
    const value = entry[field];
    counts[value] = (counts[value] || 0) + 1;
  });

  return Object.entries(counts)
    .map(([item, count]) => ({ item, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

/**
 * Delete/deactivate a short URL
 * @param {string} shortCode - The short code to delete
 * @param {string} userId - The user ID to verify ownership
 * @returns {Object} Deleted URL mapping
 */
async function deleteShortUrl(shortCode, userId) {
  logger.debug('Delete URL request', { shortCode, userId });
  
  // Find the URL
  const urlMapping = await URLMapping.findOne({ shortCode, isActive: true });
  
  if (!urlMapping) {
    logger.warn('Short URL not found or inactive', { shortCode });
    throw new NotFoundError('Short URL not found');
  }
  
  // Convert userId string to ObjectId for proper comparison
  const mongoose = require('mongoose');
  const userObjectId = new mongoose.Types.ObjectId(userId);
  
  logger.debug('Ownership check', {
    shortCode,
    urlOwnerId: urlMapping.userId.toString(),
    requestUserId: userObjectId.toString(),
    match: urlMapping.userId.equals(userObjectId)
  });
  
  // Check ownership by comparing ObjectIds
  if (!urlMapping.userId.equals(userObjectId)) {
    logger.warn('Unauthorized delete attempt', { 
      shortCode, 
      attemptedUserId: userObjectId, 
      actualOwnerId: urlMapping.userId 
    });
    throw new NotFoundError('You do not have permission to delete this URL');
  }
  
  // Permanently delete from database
  await URLMapping.findByIdAndDelete(urlMapping._id);
  
  logger.info('Short URL permanently deleted', { shortCode, userId });
  return { 
    shortCode: urlMapping.shortCode,
    deletedAt: new Date()
  };
}

/**
 * Get all short URLs (paginated)
 * @param {Object} options - Query options
 * @param {number} options.page - Page number (1-indexed)
 * @param {number} options.limit - Items per page
 * @param {boolean} options.activeOnly - Only active URLs
 * @returns {Object} Paginated results
 */
async function getAllUrls(options = {}) {
  const page = Math.max(1, options.page || 1);
  const limit = Math.min(100, options.limit || 20);
  const skip = (page - 1) * limit;

  const query = options.activeOnly !== false ? { isActive: true } : {};

  const [urls, total] = await Promise.all([
    URLMapping.find(query)
      .select('shortCode originalUrl clickCount createdAt lastAccessedAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    URLMapping.countDocuments(query),
  ]);

  return {
    data: urls,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
}

module.exports = {
  createShortUrl,
  getAndTrackUrl,
  recordUrlAccess,
  getAnalytics,
  deleteShortUrl,
  getAllUrls,
};
