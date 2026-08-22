require('dotenv').config();
const logger = require('./config/logger');

if (!process.env.JWT_SECRET) {
  logger.fatal('JWT_SECRET environment variable is missing.');
  process.exit(1);
}

const app = require('./app');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});