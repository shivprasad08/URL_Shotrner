/**
 * Environment Configuration
 * Central place for all environment variables with defaults
 */

require('dotenv').config();

module.exports = {
  // Application
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  appUrl: process.env.APP_URL || 'http://localhost:3000',

  // Database
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/url-shortener',
  mongodbTestUri: process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/url-shortener-test',

  // Logging
  logLevel: process.env.LOG_LEVEL || 'debug',
  logFile: process.env.LOG_FILE || './logs/app.log',
  logErrorFile: process.env.LOG_ERROR_FILE || './logs/error.log',

  // URL Shortener
  shortCodeLength: parseInt(process.env.SHORT_CODE_LENGTH || '6', 10),
  shortCodePrefix: process.env.SHORT_CODE_PREFIX || '',
  maxShortUrlLength: parseInt(process.env.MAX_SHORT_URL_LENGTH || '2048', 10),
  shortCodeCharset: process.env.SHORT_CODE_CHARSET || 
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',

  // Security
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
  rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),

  // Derived
  isDevelopment: process.env.NODE_ENV === 'development',
  isTest: process.env.NODE_ENV === 'test',
  isProduction: process.env.NODE_ENV === 'production',
};
