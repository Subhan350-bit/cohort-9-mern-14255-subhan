require('dotenv').config();
const app = require('./app');
const logger = require('./config/logger');

/** @type {number} */
const PORT = Number(process.env.PORT) || 5000;

/** @type {import('http').Server} */
const server = app.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

module.exports = server;