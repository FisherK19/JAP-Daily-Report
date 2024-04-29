const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../config/connection');

const router = express.Router();

// Define the login route
router.post('/login', async (req, res) => {
    // Extract email and password from request body
    const { email, password } = req.body;

    try {
        // Retrieve user from the database by email
        pool.query('SELECT * FROM users WHERE email = ?', [email], async (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ message: 'Internal server error' });
            }

            // Check if user exists
            if (results.length === 0) {
                return res.status(404).json({ message: 'User not found' });
            }

            const user = results[0];

            // Compare the provided password with the hashed password
            const passwordMatch = await bcrypt.compare(password, user.password);

            if (!passwordMatch) {
                return res.status(401).json({ message: 'Incorrect password' });
            }

            // Store user ID in the session or generate JWT token as needed

            // Send success response
            res.status(200).json({ message: 'Login successful' });
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
