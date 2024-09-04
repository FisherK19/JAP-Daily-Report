const pool = require('../config/connection');

const userController = {
    // Retrieve all users from the database
    getAllUsers(req, res) {
        pool.query('SELECT * FROM users', (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ message: 'Internal server error' });
            }
            res.json(results);
        });
    },

    // Create a new user with the request body data
    createUser(req, res) {
        const { username, email } = req.body;
        pool.query('INSERT INTO users (username, email) VALUES (?, ?)', [username, email], (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ message: 'Internal server error' });
            }
            res.status(201).json({ message: 'User created successfully' });
        });
    },

    // Update a user's information based on the user ID provided in the request parameters
    updateUser(req, res) {
        const { username, email } = req.body;
        pool.query('UPDATE users SET username = ?, email = ? WHERE id = ?', [username, email, req.params.userId], (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ message: 'Internal server error' });
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({ message: 'No user found with this ID' });
            }
            res.json({ message: 'User updated successfully' });
        });
    },

    // Delete a user and their associated thoughts based on the user ID
    deleteUser(req, res) {
        pool.query('DELETE FROM users WHERE id = ?', [req.params.userId], (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ message: 'Internal server error' });
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({ message: 'No user with that ID' });
            }
            res.json({ message: 'User deleted successfully' });
        });
    },

    // Retrieve a single user by their ID
    getUserById(req, res) {
        pool.query('SELECT * FROM users WHERE id = ?', [req.params.userId], (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ message: 'Internal server error' });
            }
            if (results.length === 0) {
                return res.status(404).json({ message: 'No user with this ID' });
            }
            res.json(results[0]);
        });
    },
};

module.exports = userController;
