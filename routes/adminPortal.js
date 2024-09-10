const express = require('express');
const router = express.Router();
const { pool } = require('../config/connection');
const path = require('path');

// Serve the admin portal HTML page
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/adminportal.html'));
});

// Fetch users for the dropdown menu
router.get('/users', async (req, res) => {
    try {
        const [results] = await pool.query('SELECT DISTINCT username FROM users WHERE username IS NOT NULL AND username != ""');
        res.status(200).json(results);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;







