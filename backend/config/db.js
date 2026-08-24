const mysql = require('mysql2/promise');
const logger = require('./logger');

const requiredEnvVars = ['DB_HOST', 'DB_USER', 'DB_NAME'];
const missingVars = requiredEnvVars.filter((key) => !process.env[key]);

if (missingVars.length > 0) {
  logger.fatal(`Missing required database environment variables: ${missingVars.join(', ')}`);
  throw new Error(`Database configuration incomplete. Missing: ${missingVars.join(', ')}`);
}

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

pool.getConnection()
  .then((conn) => {
    logger.info('MySQL Database connection pool established');
    conn.release();
  })
  .catch((err) => {
    logger.error({ err: err.message }, 'Failed to establish initial MySQL connection');
  });

module.exports = pool;