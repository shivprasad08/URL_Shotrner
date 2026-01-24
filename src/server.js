/**
 * Server Entry Point
 * Initializes database connection and starts the HTTP server
 */

require('dotenv').config();

const createApp = require('./app');
const { connectDB } = require('./config/database');
const config = require('./config/environment');
const logger = require('./utils/logger');

/**
 * Start server
 */
async function startServer() {
  try {
    // Connect to MongoDB
    await connectDB();

    // Create and start HTTP server
    const app = createApp();
    const server = app.listen(config.port, () => {
      logger.info('🚀 Server started successfully', {
        port: config.port,
        environment: config.nodeEnv,
        appUrl: config.appUrl,
      });

      logger.info('📚 API Documentation', {
        health: `${config.appUrl}/api/health`,
        shorten: `POST ${config.appUrl}/api/shorten`,
        redirect: `GET ${config.appUrl}/:shortCode`,
        analytics: `GET ${config.appUrl}/api/analytics/:shortCode`,
        systemAnalytics: `GET ${config.appUrl}/api/analytics`,
      });
    });

    // Graceful shutdown
    process.on('SIGINT', () => {
      logger.info('SIGINT received, shutting down gracefully');
      server.close(() => {
        logger.info('Server closed');
        process.exit(0);
      });
    });

    process.on('SIGTERM', () => {
      logger.info('SIGTERM received, shutting down gracefully');
      server.close(() => {
        logger.info('Server closed');
        process.exit(0);
      });
    });
  } catch (error) {
    logger.error('Failed to start server', { error: error.message });
    process.exit(1);
  }
}

// Start the server
if (require.main === module) {
  startServer();
}

module.exports = startServer;
