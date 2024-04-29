const express = require('express');
const router = express.Router();
const pool = require('../config/connection');

// Route for retrieving all users
router.get('/', (req, res) => {
    pool.query('SELECT * FROM users', (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
        res.status(200).json({ users: results });
    });
});

// Route for retrieving a specific user by ID
router.get('/:id', (req, res) => {
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
router.put('/:id', (req, res) => {
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
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    pool.query('DELETE FROM users WHERE id = ?', [id], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    });
});

module.exports = router;


