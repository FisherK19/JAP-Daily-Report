const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { pool } = require('../config/connection');
const { body, validationResult } = require('express-validator');

// Registration route with input validation
router.post(
  '/',
  [
    body('email').isEmail(),
    body('username').not().isEmpty(),
    body('password').isLength({ min: 5 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    // Log the registration data
    console.log('Registration Data:', { username, email, password });

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log('Hashed Password:', hashedPassword);

      const [result] = await pool.query(
        'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
        [username, email, hashedPassword]
      );

      // Log the insert result
      console.log('Insert Result:', result);

      res.redirect('/login');
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

module.exports = router;


