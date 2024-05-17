const express = require('express');
const router = express.Router();
const { pool } = require('../config/connection');
const path = require('path');

// Serve the daily-report.html file
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'daily-report.html'));
});

// Route to submit a new daily report
router.post('/', (req, res) => {
    const { date, jobNumber, TnM, contract, foreman, cellNumber, customer, customerPO, jobSite, jobDescription, jobCompletion, materialDescription, equipmentDescription, hoursWorked, employee, straightTime, doubleTime, timeAndAHalf, emergencyPurchases, approvedBy } = req.body;

    pool.query(
        'INSERT INTO daily_reports (date, job_number, tnm, contract, foreman, cell_number, customer, customer_po, job_site, job_description, job_completion, material_description, equipment_description, hours_worked, employee, straight_time, double_time, time_and_a_half, emergency_purchases, approved_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [date, jobNumber, TnM, contract, foreman, cellNumber, customer, customerPO, jobSite, jobDescription, jobCompletion, materialDescription, equipmentDescription, hoursWorked, employee, straightTime, doubleTime, timeAndAHalf, emergencyPurchases, approvedBy],
        (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ message: 'Internal server error' });
            }
            res.status(201).json({ message: 'Daily report submitted successfully' });
        }
    );
});

module.exports = router;
