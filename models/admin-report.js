// admin-report.js

const pool = require('../config/connection');

const AdminReport = {
    // Function to create a new admin report
    create: function(reportDetails, callback) {
        pool.query('INSERT INTO admin_reports (report_details) VALUES (?)', [reportDetails], function(error, results, fields) {
            if (error) {
                return callback(error, null);
            }
            return callback(null, results.insertId);
        });
    },

    // Function to get all admin reports
    getAll: function(callback) {
        pool.query('SELECT * FROM admin_reports', function(error, results, fields) {
            if (error) {
                return callback(error, null);
            }
            return callback(null, results);
        });
    },

    // Function to get an admin report by ID
    getById: function(id, callback) {
        pool.query('SELECT * FROM admin_reports WHERE id = ?', [id], function(error, results, fields) {
            if (error) {
                return callback(error, null);
            }
            if (results.length === 0) {
                return callback({ message: 'Admin report not found' }, null);
            }
            return callback(null, results[0]);
        });
    },

    // Function to update an admin report
    update: function(id, reportDetails, callback) {
        pool.query('UPDATE admin_reports SET report_details = ? WHERE id = ?', [reportDetails, id], function(error, results, fields) {
            if (error) {
                return callback(error, null);
            }
            return callback(null, results.affectedRows);
        });
    },

    // Function to delete an admin report
    delete: function(id, callback) {
        pool.query('DELETE FROM admin_reports WHERE id = ?', [id], function(error, results, fields) {
            if (error) {
                return callback(error, null);
            }
            return callback(null, results.affectedRows);
        });
    }
};

module.exports = AdminReport;
