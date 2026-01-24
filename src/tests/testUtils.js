/**
 * Test Utilities
 * Helper functions and utilities for testing
 */

const mongoose = require('mongoose');
const request = require('supertest');
const config = require('../config/environment');

/**
 * Connect to test database
 */
async function connectTestDB() {
  try {
    const mongoUri = process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/url-shortener-test';
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (error) {
    console.error('Failed to connect to test database:', error.message);
    throw error;
  }
}

/**
 * Disconnect from test database
 */
async function disconnectTestDB() {
  try {
    await mongoose.disconnect();
  } catch (error) {
    console.error('Failed to disconnect from test database:', error.message);
    throw error;
  }
}

/**
 * Clear all collections in test database
 */
async function clearDatabase() {
  try {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  } catch (error) {
    console.error('Failed to clear test database:', error.message);
    throw error;
  }
}

/**
 * Create a test URL in database
 */
async function createTestUrl(overrides = {}) {
  const URLMapping = require('../models/URLMapping');
  const defaults = {
    originalUrl: 'https://www.example.com/very/long/url/path',
    shortCode: 'test123',
    clickCount: 0,
  };
  return new URLMapping({ ...defaults, ...overrides }).save();
}

/**
 * Generate test API request
 */
function makeRequest(app) {
  return request(app);
}

module.exports = {
  connectTestDB,
  disconnectTestDB,
  clearDatabase,
  createTestUrl,
  makeRequest,
};
