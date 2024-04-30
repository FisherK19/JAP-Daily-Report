const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../config/connection');

const router = express.Router();

// Admin Login Route
router.post('/admin/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Query the database to retrieve admin user with the provided username
        pool.query('SELECT * FROM admin_users WHERE username = ?', [username], async (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ message: 'Internal server error' });
            }

            if (results.length === 0) {
                return res.status(401).json({ message: 'Invalid username or password' });
            }

            // Compare passwords
            const match = await bcrypt.compare(password, results[0].password);
            if (!match) {
                return res.status(401).json({ message: 'Invalid username or password' });
            }

            // Authentication successful
            // Create session or JWT token (not implemented here)
            // For session-based authentication, you can use express-session

            // Respond with success message
            res.status(200).json({ message: 'Login successful' });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
