const jwt = require('jsonwebtoken');
const logger = require('../config/logger');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'] || '';
  const [scheme, token] = authHeader.split(' ');

  if (!token || scheme !== 'Bearer') {
    logger.warn({ path: req.originalUrl, ip: req.ip }, 'Unauthorized request: missing or malformed token');
    return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decodedUser) => {
    if (err) {
      logger.warn({ error: err.message, path: req.originalUrl }, 'Unauthorized: token verification failed');
      return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
    }
    req.user = decodedUser;
    next();
  });
};

module.exports = authenticateToken;