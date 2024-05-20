const express = require('express');
const crypto = require('crypto');
const { pool } = require('../config/connection');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const path = require('path');
require('dotenv').config();

const router = express.Router();

// Nodemailer configuration
const transporter = nodemailer.createTransport({
    service: 'Outlook',
    auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Request password reset
router.post('/forgot-password', (req, res) => {
    const { email } = req.body;

    // Check if user exists
    pool.query('SELECT * FROM users WHERE email = ?', [email], (error, results) => {
        if (error || results.length === 0) {
            return res.status(400).json({ message: 'User with this email does not exist.' });
        }

        const user = results[0];
        const token = crypto.randomBytes(20).toString('hex');

        // Set expiration time for token (1 hour)
        const expireTime = Date.now() + 3600000; // 1 hour

        // Save token and expiration time to database
        pool.query(
            'UPDATE users SET reset_password_token = ?, reset_password_expires = ? WHERE email = ?',
            [token, expireTime, email],
            (err) => {
                if (err) {
                    console.error('Error updating user:', err);
                    return res.status(500).json({ message: 'Error updating the database.' });
                }

                // Send email
                const mailOptions = {
                    to: user.email,
                    from: process.env.EMAIL_ADDRESS,
                    subject: 'Password Reset',
                    text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` +
                          `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
                          `http://${req.headers.host}/reset-password/${token}\n\n` +
                          `If you did not request this, please ignore this email and your password will remain unchanged.\n`
                };

                transporter.sendMail(mailOptions, (error) => {
                    if (error) {
                        console.error('Error sending email:', error);
                        return res.status(500).json({ message: 'Error sending email.' });
                    }
                    res.status(200).json({ message: 'Password reset email sent successfully.' });
                });
            }
        );
    });
});

// Reset password form
router.get('/reset-password/:token', (req, res) => {
    const { token } = req.params;

    // Check if token is valid and not expired
    pool.query('SELECT * FROM users WHERE reset_password_token = ? AND reset_password_expires > ?', [token, Date.now()], (error, results) => {
        if (error || results.length === 0) {
            return res.status(400).json({ message: 'Password reset token is invalid or has expired.' });
        }

        // Render reset password form
        res.render('reset-password', { token });
    });
});

// Update password
router.post('/reset-password/:token', (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    // Check if token is valid and not expired
    pool.query('SELECT * FROM users WHERE reset_password_token = ? AND reset_password_expires > ?', [token, Date.now()], (error, results) => {
        if (error || results.length === 0) {
            return res.status(400).json({ message: 'Password reset token is invalid or has expired.' });
        }

        const user = results[0];

        // Hash the new password
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                return res.status(500).json({ message: 'Error hashing the password.' });
            }

            // Update password in the database and clear the reset token
            pool.query(
                'UPDATE users SET password = ?, reset_password_token = NULL, reset_password_expires = NULL WHERE email = ?',
                [hashedPassword, user.email],
                (err) => {
                    if (err) {
                        return res.status(500).json({ message: 'Error updating the database.' });
                    }
                    res.status(200).json({ message: 'Password has been updated successfully.' });
                }
            );
        });
    });
});

module.exports = router;
