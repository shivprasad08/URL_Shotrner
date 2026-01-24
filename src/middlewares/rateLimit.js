/**
 * Rate Limiting Middleware
 * Basic rate limiting to prevent abuse
 */

const config = require('../config/environment');
const logger = require('../utils/logger');
const { RateLimitError } = require('../utils/errors');

// In-memory store for rate limiting (use Redis in production)
// Map: { ip: { count: number, resetTime: timestamp } }
const rateLimitStore = new Map();

/**
 * Simple rate limiter middleware
 * Limits requests per IP address per time window
 */
function rateLimit() {
  return (req, res, next) => {
    const ip = req.ip;
    const now = Date.now();

    // Get or initialize rate limit data for this IP
    let limiterData = rateLimitStore.get(ip);

    if (!limiterData) {
      limiterData = {
        count: 1,
        resetTime: now + config.rateLimitWindowMs,
      };
      rateLimitStore.set(ip, limiterData);
      return next();
    }

    // Check if window has expired
    if (now > limiterData.resetTime) {
      limiterData = {
        count: 1,
        resetTime: now + config.rateLimitWindowMs,
      };
      rateLimitStore.set(ip, limiterData);
      return next();
    }

    // Increment count
    limiterData.count += 1;

    // Check if limit exceeded
    if (limiterData.count > config.rateLimitMaxRequests) {
      logger.warn('Rate limit exceeded', {
        ip,
        count: limiterData.count,
        limit: config.rateLimitMaxRequests,
      });

      return res.status(429).json({
        success: false,
        error: 'Too many requests. Please try again later.',
        retryAfter: Math.ceil((limiterData.resetTime - now) / 1000),
      });
    }

    // Add rate limit info to response headers
    res.set('X-RateLimit-Limit', config.rateLimitMaxRequests.toString());
    res.set('X-RateLimit-Remaining', (config.rateLimitMaxRequests - limiterData.count).toString());
    res.set('X-RateLimit-Reset', Math.ceil(limiterData.resetTime / 1000).toString());

    next();
  };
}

/**
 * Cleanup old entries from rate limit store (run periodically)
 */
function cleanupRateLimitStore() {
  const now = Date.now();
  let cleaned = 0;

  for (const [ip, data] of rateLimitStore.entries()) {
    if (now > data.resetTime) {
      rateLimitStore.delete(ip);
      cleaned += 1;
    }
  }

  if (cleaned > 0) {
    logger.debug('Rate limit store cleanup', { cleaned, remaining: rateLimitStore.size });
  }
}

// Run cleanup every hour
setInterval(cleanupRateLimitStore, 60 * 60 * 1000);

module.exports = {
  rateLimit,
  cleanupRateLimitStore,
};
