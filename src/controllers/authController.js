const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { BadRequestError, UnauthorizedError } = require('../utils/errors');

function signToken(user) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new BadRequestError('Server auth configuration missing');
  }
  return jwt.sign({ id: user._id.toString(), email: user.email }, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

async function signup(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new BadRequestError('Email and password are required');
    }
    const existing = await User.findOne({ email });
    if (existing) {
      throw new BadRequestError('Email already registered');
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashed });
    const token = signToken(user);
    res.status(201).json({
      success: true,
      data: { token, user: { id: user._id, email: user.email } },
    });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new BadRequestError('Email and password are required');
    }
    const user = await User.findOne({ email });
    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new UnauthorizedError('Invalid credentials');
    }
    const token = signToken(user);
    res.json({ success: true, data: { token, user: { id: user._id, email: user.email } } });
  } catch (err) {
    next(err);
  }
}

module.exports = { signup, login };
