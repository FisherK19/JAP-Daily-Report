const express = require('express');
const bcrypt = require('bcrypt');
const { pool } = require('../config/connection');

const router = express.Router();

// Admin Register Route
router.post('/', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new admin user into the database
        pool.query('INSERT INTO admin_users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword], (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ message: 'Internal server error' });
            }
            
            // Respond with success message
            res.redirect('/admin/login');
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
