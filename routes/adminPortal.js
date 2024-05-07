const express = require('express');
const router = express.Router();
const { pool } = require('../config/connection');

// Route for rendering the admin portal
router.get('/', (req, res) => {
    res.render('adminportal.html'); 
});

// Route for retrieving all users
router.get('/users', (req, res) => {
    pool.query('SELECT * FROM users', (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
        res.status(200).json({ users: results });
    });
});

// Route for retrieving a specific user by ID
router.get('/users/:id', (req, res) => {
    const { id } = req.params;
    pool.query('SELECT * FROM users WHERE id = ?', [id], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ user: results[0] });
    });
});

// Route for updating a user's information
router.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const { username, email, password } = req.body;
    pool.query('UPDATE users SET username = ?, email = ?, password = ? WHERE id = ?', [username, email, password, id], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
        res.status(200).json({ message: 'User updated successfully' });
    });
});

// Route for deleting a user
router.delete('/users/:id', (req, res) => {
    const { id } = req.params;
    pool.query('DELETE FROM users WHERE id = ?', [id], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    });
});

// Route for serving PDF reports
router.get('/report/pdf/:userId', (req, res) => {
    // Logic to generate and serve PDF report
});

// Route for serving Excel reports
router.get('/report/excel/:userId', (req, res) => {
    // Logic to generate and serve Excel report
});

module.exports = router;
