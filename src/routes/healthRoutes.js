/**
 * Health Check Routes
 * Routes for system health and status
 */

const express = require('express');
const router = express.Router();

const healthController = require('../controllers/healthController');

/**
 * GET /api/health
 * Health check endpoint
 */
router.get('/health', healthController.healthCheck);

module.exports = router;
