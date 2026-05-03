import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const isAiven = process.env.DB_SSL === 'true';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'amatalink',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ...(isAiven && {
    ssl: {
      rejectUnauthorized: false,
    },
  }),
});

export default pool;
