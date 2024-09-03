// daily-report.js

const pool = require('../config/connection');

const DailyReport = {
    // Function to create a new daily report
    create: function(date, jobNumber, callback) {
        pool.query('INSERT INTO daily_reports (date, job_number) VALUES (?, ?)', [date, jobNumber], function(error, results, fields) {
            if (error) {
                return callback(error, null);
            }
            return callback(null, results.insertId);
        });
    },

    // Function to get all daily reports
    getAll: function(callback) {
        pool.query('SELECT * FROM daily_reports', function(error, results, fields) {
            if (error) {
                return callback(error, null);
            }
            return callback(null, results);
        });
    }
};

module.exports = DailyReport;
