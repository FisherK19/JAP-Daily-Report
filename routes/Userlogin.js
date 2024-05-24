const express = require('express');
const bcrypt = require('bcrypt');
const { pool } = require('../config/connection');
const router = express.Router();
const path = require('path');

// Serve login page
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/login.html'));
});

// POST route for login
router.post('/', async (req, res) => {
    const { username, password } = req.body;
    console.log('Login attempt:', { username });

    try {
        const [results] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);

        if (results.length === 0) {
            console.log('User not found:', username);
            return res.status(404).json({ message: 'User not found' });
        }

        const user = results[0];
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            console.log('Incorrect password for user:', username);
            return res.status(401).json({ message: 'Incorrect password' });
        }

        req.session.user = user; // Store user data in session
        console.log('User logged in:', user.id);
        res.redirect('/daily-report'); // Redirect to the daily reports page
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
