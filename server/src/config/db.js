const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

const mysql = require('mysql2/promise');

const { ensureSchema } = require('../db/schema');

let pool = null;
let databaseState = 'disconnected';
let lastErrorMessage = null;

const parsePort = (value, fallback) => {
  const port = Number(value);
  return Number.isInteger(port) && port > 0 ? port : fallback;
};

const getDatabaseName = () => process.env.MYSQL_DATABASE || 'gigyaatra';

const getBaseConfig = () => ({
  host: process.env.MYSQL_HOST || '127.0.0.1',
  port: parsePort(process.env.MYSQL_PORT, 3306),
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  ...(process.env.MYSQL_USE_SSL === 'true' && {
    ssl: { ca: fs.readFileSync(path.join(__dirname, '../certs/ca.pem')) },
  }),
});

const getPoolConfig = () => ({
  ...getBaseConfig(),
  database: getDatabaseName(),
  waitForConnections: true,
  connectionLimit: parsePort(process.env.MYSQL_CONNECTION_LIMIT, 10),
  queueLimit: 0,
});

const ensureDatabaseExists = async () => {
  const connection = await mysql.createConnection(getBaseConfig());

  try {
    await connection.query(
      'CREATE DATABASE IF NOT EXISTS ?? CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci',
      [getDatabaseName()]
    );
  } finally {
    await connection.end();
  }
};

const connectDatabase = async () => {
  databaseState = 'connecting';
  lastErrorMessage = null;

  try {
    await ensureDatabaseExists();
    pool = mysql.createPool(getPoolConfig());
    await ensureSchema(pool);
    await pool.query('SELECT 1');
    databaseState = 'connected';
    console.log(`MySQL connected: ${getDatabaseName()}`);
    return pool;
  } catch (error) {
    databaseState = 'error';
    lastErrorMessage = error.message;

    if (pool) {
      await pool.end().catch(() => null);
      pool = null;
    }

    throw error;
  }
};

const query = async (statement, params = []) => {
  if (!pool) {
    throw new Error('Database pool has not been initialized');
  }

  return pool.execute(statement, params);
};

const getDatabaseStatus = () => ({
  engine: 'mysql',
  database: getDatabaseName(),
  host: getBaseConfig().host,
  port: getBaseConfig().port,
  readyState: databaseState,
  error: process.env.NODE_ENV === 'development' ? lastErrorMessage : undefined,
});

const disconnectDatabase = async () => {
  if (!pool) {
    databaseState = 'disconnected';
    return;
  }

  await pool.end();
  pool = null;
  databaseState = 'disconnected';
};

module.exports = { connectDatabase, disconnectDatabase, getDatabaseStatus, query };
