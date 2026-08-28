const jwt = require('jsonwebtoken');
const logger = require('../config/logger');

/**
 * Authentication verification middleware
 * @type {import('express').RequestHandler}
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'secretkey', (err, decodedUser) => {
    if (err) {
      logger.warn({ error: err.message, path: String(req.originalUrl || '').replace(/[\r\n]/g, '') }, 'Authentication failed: invalid or expired token');
      return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
    }

    req.user = decodedUser;
    next();
  });
};

module.exports = authenticateToken;