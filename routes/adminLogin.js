const express = require('express');
const bcrypt = require('bcrypt');
const { pool } = require('../config/connection');
const router = express.Router();

// Admin Login Page
router.get('/', function(req, res) {
    res.render('adminLogin.html');  // Make sure 'adminLogin.html' exists in your views directory
});

// Admin Login Action
router.post('/', async (req, res) => {
    try {
        const { username, password } = req.body;
        pool.query('SELECT * FROM admin_users WHERE username = ?', [username], async (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ message: 'Internal server error' });
            }
            if (results.length === 0) {
                return res.status(401).json({ message: 'Invalid username or password' });
            }
            const match = await bcrypt.compare(password, results[0].password);
            if (!match) {
                return res.status(401).json({ message: 'Invalid username or password' });
            }
            // Authentication successful
            req.session.user = results[0];  // Store user info in session
            res.redirect('/admin/portal');  // Redirect to the admin portal
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Admin Portal Page
router.get('/portal', (req, res) => {
    if (req.session && req.session.user) {  // Check if session and user exist
        res.render('adminportal.html');  // Make sure 'adminPortal.html' is correctly set up in your views directory
    } else {
        res.redirect('/admin');  // Redirect to login page if there is no session or user info
    }
});

module.exports = router;

