/**
 * Express Application Setup
 * Configures Express app with all middleware and routes
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const config = require('./config/environment');
const logger = require('./utils/logger');

// Import middleware
const { requestLogger, securityHeaders } = require('./middlewares/logging');
const { rateLimit } = require('./middlewares/rateLimit');
const { errorHandler } = require('./middlewares/errorHandler');

// Import routes
const urlRoutes = require('./routes/urlRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const redirectRoutes = require('./routes/redirectRoutes');
const healthRoutes = require('./routes/healthRoutes');

/**
 * Create and configure Express application
 */
function createApp() {
  const app = express();

  // ==================== Security Middleware ====================
  app.use(helmet()); // Set security HTTP headers

  // ==================== CORS Configuration ====================
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN || '*',
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  // ==================== Request Parsing ====================
  app.use(express.json({ limit: '10kb' })); // Parse JSON bodies with 10KB limit
  app.use(express.urlencoded({ extended: true, limit: '10kb' }));

  // ==================== Custom Middleware ====================
  app.use(requestLogger); // Log all requests
  app.use(securityHeaders); // Add security headers

  // ==================== Rate Limiting ====================
  // Apply rate limiting to all routes (stricter for API endpoints)
  app.use(rateLimit());

  // ==================== API Routes ====================
  // Health check - no rate limiting needed
  app.use('/', healthRoutes);

  // API v1 routes
  app.use('/api', urlRoutes);
  app.use('/api/analytics', analyticsRoutes);

  // Redirect routes (catch-all for short codes) - must be last
  // This handles GET /:shortCode redirects
  app.use('/', redirectRoutes);

  // ==================== 404 Handler ====================
  app.use((req, res) => {
    logger.warn('404 - Route not found', { method: req.method, path: req.path });
    res.status(404).json({
      success: false,
      error: 'Route not found',
      path: req.path,
    });
  });

  // ==================== Error Handling ====================
  // Must be the last middleware
  app.use(errorHandler);

  // ==================== Request Metadata ====================
  app.set('trust proxy', 1); // Trust proxy headers for IP address

  logger.info('✓ Express app configured successfully', {
    environment: config.nodeEnv,
    port: config.port,
  });

  return app;
}

module.exports = createApp;
