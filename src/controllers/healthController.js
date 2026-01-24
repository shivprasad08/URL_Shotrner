/**
 * Health Check Controller
 * Provides system health and status information
 */

const { connectDB } = require('../config/database');
const logger = require('../utils/logger');
const mongoose = require('mongoose');

/**
 * GET /api/health
 * Health check endpoint
 */
async function healthCheck(req, res) {
  try {
    const dbConnected = mongoose.connection.readyState === 1;

    const health = {
      status: dbConnected ? 'healthy' : 'degraded',
      timestamp: new Date(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      database: {
        connected: dbConnected,
        readyState: mongoose.connection.readyState,
      },
      version: require('../../package.json').version,
    };

    const statusCode = dbConnected ? 200 : 503;

    res.status(statusCode).json({
      success: true,
      data: health,
    });
  } catch (error) {
    logger.error('Health check failed', { error: error.message });
    res.status(503).json({
      success: false,
      status: 'unhealthy',
      error: error.message,
    });
  }
}

module.exports = {
  healthCheck,
};
