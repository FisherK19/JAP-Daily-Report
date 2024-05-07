const express = require('express');
const router = express.Router();
const { pool } = require('../config/connection');

// Route to fetch user data
router.get('/', (req, res) => {
    // Query the database to fetch user data
    pool.query('SELECT * FROM users', (error, results) => {
        if (error) {
            console.error('Database error:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
        // Send back the user data as a JSON response
        res.json({ users: results });
    });
});

module.exports = router;
