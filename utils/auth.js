const express = require('express');
const bcrypt = require('bcrypt');
const { User } = require('../models'); 

const router = express.Router();

// Route for user registration
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if the user already exists
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user in the database
        const newUser = await User.create(username, email, hashedPassword);

        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Route for user login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the password is correct
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Incorrect password' });
        }

        // Set user session or generate JWT token for authentication

        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// Authentication middleware to protect routes
function authenticateUser(req, res, next) {
    // Check if user is authenticated (e.g., check session or verify JWT token)
    // If authenticated, call next()
    // If not authenticated, return res.status(401).json({ message: 'Unauthorized' });
}

module.exports = router;
