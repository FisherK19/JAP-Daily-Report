require('dotenv').config();
const mysql = require('mysql');

// Create a MySQL connection pool
const pool = mysql.createPool({
  connectionLimit: 80,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});

// Export the connection pool
module.exports = pool;
