require('dotenv').config();
const mysql = require('mysql2');
const nodemailer = require('nodemailer');
const url = require('url');

// Parse JAWSDB_URL to get connection details
const dbUrl = new URL(process.env.JAWSDB_URL);

// Create a MySQL connection pool
const pool = mysql.createPool({
  connectionLimit: 80,
  host: dbUrl.hostname,
  user: dbUrl.username,
  password: dbUrl.password,
  database: dbUrl.pathname.substring(1),
}).promise();

// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.office365.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Export the connection pool and the transporter
module.exports = { pool, transporter };

