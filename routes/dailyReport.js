const express = require('express');
const router = express.Router();
const { pool } = require('../config/connection');

// Route to submit a new daily report
router.post('/', (req, res) => {
    const {
        date, job_number, contract, foreman, cell_number, customer, customer_po,
        job_site, job_description, job_completion, manlifts_equipment, manlifts_fuel,
        sub_contract, emergency_purchases, delay_lost_time, employees_off, temperature_humidity,
        approved_by, report_copy
    } = req.body;

    console.log('Received data:', req.body); // Log received data

    const sql = `
        INSERT INTO daily_reports (
            date, job_number, contract, foreman, cell_number, customer, customer_po,
            job_site, job_description, job_completion, manlifts_equipment, manlifts_fuel,
            sub_contract, emergency_purchases, delay_lost_time, employees_off, temperature_humidity,
            approved_by, report_copy
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        date, job_number, contract ? 1 : 0, foreman, cell_number, customer, customer_po,
        job_site, job_description, job_completion, manlifts_equipment, manlifts_fuel,
        sub_contract, emergency_purchases, delay_lost_time, employees_off, temperature_humidity,
        approved_by, report_copy
    ];

    pool.query(sql, values, (error, results) => {
        if (error) {
            console.error('Error inserting data:', error.sqlMessage);
            return res.status(500).json({ message: 'Internal server error', error: error.sqlMessage });
        }
        res.status(201).json({ message: 'Daily report submitted successfully' });
    });
});

module.exports = router;
