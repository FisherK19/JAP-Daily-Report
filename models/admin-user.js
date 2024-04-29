// adminUser.js

const pool = require('../config/connection');

const AdminUser = {
    // Function to create a new admin user
    create: function(username, email, password, role, callback) {
        pool.query('INSERT INTO admin_users (username, email, password, role) VALUES (?, ?, ?, ?)', [username, email, password, role], function(error, results, fields) {
            if (error) {
                return callback(error, null);
            }
            return callback(null, results.insertId);
        });
    },

    // Function to find an admin user by username
    findByUsername: function(username, callback) {
        pool.query('SELECT * FROM admin_users WHERE username = ?', [username], function(error, results, fields) {
            if (error) {
                return callback(error, null);
            }
            if (results.length === 0) {
                return callback(null, null);
            }
            return callback(null, results[0]);
        });
    },

    // Function to find an admin user by email
    findByEmail: function(email, callback) {
        pool.query('SELECT * FROM admin_users WHERE email = ?', [email], function(error, results, fields) {
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

module.exports = AdminUser;
