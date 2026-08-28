const mysql = require('mysql2/promise');
const logger = require('./logger');

/** @type {import('mysql2/promise').Pool} */
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'notes_app',
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

pool.getConnection()
  .then((conn) => {
    logger.info('MySQL Database connection pool established');
    conn.release();
  })
  .catch((err) => {
    logger.error({ err }, 'MySQL Connection Failed');
  });

module.exports = pool;