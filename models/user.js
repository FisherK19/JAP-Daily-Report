// user.js

const pool = require('../config/connection');

const User = {
    // Function to create a new user
    create: function(username, email, password, role, callback) {
        pool.query('INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)', [username, email, password, role], function(error, results, fields) {
            if (error) {
                return callback(error, null);
            }
            return callback(null, results.insertId);
        });
    },

    // Function to find a user by username
    findByUsername: function(username, callback) {
        pool.query('SELECT * FROM users WHERE username = ?', [username], function(error, results, fields) {
            if (error) {
                return callback(error, null);
            }
            if (results.length === 0) {
                return callback(null, null);
            }
            return callback(null, results[0]);
        });
    },

    // Function to find a user by email
    findByEmail: function(email, callback) {
        pool.query('SELECT * FROM users WHERE email = ?', [email], function(error, results, fields) {
            if (error) {
                return callback(error, null);
            }
            if (results.length === 0) {
                return callback(null, null);
            }
            return callback(null, results[0]);
        });
    }
};

module.exports = User;
