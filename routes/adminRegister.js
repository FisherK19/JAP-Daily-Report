const express = require('express');
const bcrypt = require('bcrypt');
const { pool } = require('../config/connection');
const path = require('path');
const { body, validationResult } = require('express-validator');
const router = express.Router();

// Serve the admin registration page
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'adminregister.html'));
});

// Handle admin registration form submission
router.post(
  '/',
  [
    body('username').not().isEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters long'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    try {
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert new admin user into the database
      const [result] = await pool.query(
        'INSERT INTO admin_users (username, email, password) VALUES (?, ?, ?)',
        [username, email, hashedPassword]
      );

      // Redirect to admin login page upon successful registration
      res.redirect('/admin/login');
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ message: 'Username or email already exists' });
      }

      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

module.exports = router;

