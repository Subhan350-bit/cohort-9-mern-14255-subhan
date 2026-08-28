const pino = require('pino');

/** @type {import('pino').LoggerOptions} */
const pinoOptions = {
  level: process.env.LOG_LEVEL || 'info',
  transport: process.env.NODE_ENV !== 'production'
    ? {
        target: 'pino-pretty',
        options: { colorize: true },
      }
    : undefined,
};

/** @type {import('pino').Logger} */
const logger = pino(pinoOptions);

module.exports = logger;