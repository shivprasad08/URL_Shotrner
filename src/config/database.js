/**
 * Database Configuration Module
 * Handles MongoDB connection setup and configuration
 */

const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/url-shortener';
    
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    logger.info('✓ MongoDB connected successfully', { uri: mongoUri.split('@')[1] || mongoUri });
    return mongoose.connection;
  } catch (error) {
    logger.error('✗ MongoDB connection failed', { error: error.message });
    process.exit(1);
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    logger.info('✓ MongoDB disconnected');
  } catch (error) {
    logger.error('✗ MongoDB disconnection failed', { error: error.message });
  }
};

module.exports = { connectDB, disconnectDB };
