const logger = require('../config/logger');

/**
 * Express global error handler middleware
 * @type {import('express').ErrorRequestHandler}
 */
const errorHandler = (err, req, res, next) => {
  logger.error(err);

  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : (err.statusCode || 500);
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

/**
 * Not Found (404) route middleware
 * @type {import('express').RequestHandler}
 */
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

module.exports = { errorHandler, notFound };