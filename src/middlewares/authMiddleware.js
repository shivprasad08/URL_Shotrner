const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../utils/errors');

function extractToken(req) {
  const header = req.headers['authorization'] || req.headers['Authorization'];
  if (!header) return null;
  const parts = header.split(' ');
  if (parts.length !== 2) return null;
  const [scheme, token] = parts;
  if (!/^Bearer$/i.test(scheme)) return null;
  return token;
}

function authMiddleware(req, res, next) {
  try {
    const token = extractToken(req);
    if (!token) {
      throw new UnauthorizedError('Authorization token missing');
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new UnauthorizedError('Server auth configuration missing');
    }

    const payload = jwt.verify(token, secret);
    req.user = { id: payload.id, email: payload.email };
    next();
  } catch (err) {
    next(new UnauthorizedError('Invalid or expired token'));
  }
}

module.exports = { authMiddleware };
