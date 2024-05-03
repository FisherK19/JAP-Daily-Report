require('dotenv').config();
const mysql = require('mysql');
const nodemailer = require('nodemailer');

// Create a MySQL connection pool
const pool = mysql.createPool({
  connectionLimit: 80,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});

// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: 587,
    secure: false, // Upgrade later with STARTTLS
    auth: {
        user: process.env.EMAIL_ADDRESS, 
        pass: process.env.EMAIL_PASSWORD 
    }
});

// Export the connection pool and the transporter
module.exports = { pool, transporter };

