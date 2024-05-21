const express = require('express');
const bcrypt = require('bcrypt');
const { pool } = require('../config/connection');
const path = require('path');
const router = express.Router();

// Admin Login Page
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'adminlogin.html'));
});

// Admin Login Action
router.post('/', async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log('Admin login attempt:', { username });

        // Use async/await for pool.query
        const [results] = await pool.query('SELECT * FROM admin_users WHERE username = ?', [username]);

        if (results.length === 0) {
            console.log('Invalid username or password');
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const match = await bcrypt.compare(password, results[0].password);
        if (!match) {
            console.log('Invalid username or password');
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Authentication successful
        req.session.user = results[0];  // Store user info in session
        console.log('Redirecting to /admin/portal');
        res.redirect('/admin/portal');  // Redirect to the admin portal
    } catch (error) {
        console.error('Error during admin login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;

