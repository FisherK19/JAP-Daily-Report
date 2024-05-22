// config/initializeDB.js
const mysql = require('mysql2/promise');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

async function initDb() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  const sql = fs.readFileSync(path.join(__dirname, '../db/schema.sql'), 'utf8');

  try {
    await connection.query(sql);
    console.log('Database initialized');
  } catch (err) {
    console.error('Database initialization failed:', err);
    throw err;
  } finally {
    await connection.end();
  }
}

module.exports = initDb;
