const fs = require('fs');
const path = require('path');
const { pool } = require('./connection');

const initDb = async () => {
    const sql = fs.readFileSync(path.join(__dirname, '../db/schema.sql'), 'utf-8');
    try {
        await pool.query(sql);
        console.log('Database schema initialized successfully');
    } catch (err) {
        console.error('Error initializing database schema:', err);
    }
};

module.exports = initDb;

