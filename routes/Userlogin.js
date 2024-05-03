const express = require('express');
const bcrypt = require('bcrypt');
const { pool } = require('../config/connection');
const router = express.Router();
const path = require('path');

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../Templates/login.html'));
});
// POST route for login
// POST route for login
router.post('/', async (req, res) => {
    const { username, password } = req.body;

    try {
        console.log(pool); // Log the pool object for debugging
        pool.query('SELECT * FROM users WHERE username = ?', [username], async (error, results) => {
            if (error) {
                console.error('Database error:', error);
                return res.status(500).send('Internal server error');
            }
            if (results.length === 0) {
                return res.status(404).send('User not found');
            }

            const user = results[0];
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                return res.status(401).send('Incorrect password');
            }
            
            req.session.user = user; // Store user data in session
            res.redirect('/daily-report'); // Redirect to the daily reports page
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).send('Internal server error');
    }
});


module.exports = router;


