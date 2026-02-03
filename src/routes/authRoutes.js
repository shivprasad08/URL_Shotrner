const express = require('express');
const router = express.Router();

const { signup, login } = require('../controllers/authController');
const { asyncHandler } = require('../middlewares/errorHandler');

// POST /api/auth/signup
router.post('/signup', asyncHandler(signup));

// POST /api/auth/login
router.post('/login', asyncHandler(login));

module.exports = router;
