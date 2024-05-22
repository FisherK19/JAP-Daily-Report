const express = require('express');
const router = express.Router();
const { pool } = require('../config/connection');
const path = require('path');

// Serve the daily report HTML
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'daily-report.html'));
});

// Route to handle daily report submission
router.post('/', async (req, res) => {
    try {
        const {
            date, job_number, t_and_m, contract, foreman, cell_number, customer, customer_po,
            job_site, job_description, job_completion, material_description, equipment_description,
            hours_worked, employee, straight_time, double_time, time_and_a_half,
            emergency_purchases, approved_by, shift_start_time, temperature_humidity, report_copy,
            manlifts_equipment, manlifts_fuel, delay_lost_time, employees_off, sub_contract
        } = req.body;

        console.log('Received data:', req.body);

        const sql = `
            INSERT INTO daily_reports (
                date, job_number, t_and_m, contract, foreman, cell_number, customer, customer_po,
                job_site, job_description, job_completion, material_description, equipment_description,
                hours_worked, employee, straight_time, double_time, time_and_a_half,
                emergency_purchases, approved_by, shift_start_time, temperature_humidity, report_copy,
                manlifts_equipment, manlifts_fuel, delay_lost_time, employees_off, sub_contract
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            date, job_number, t_and_m ? 1 : 0, contract ? 1 : 0, foreman, cell_number, customer, customer_po,
            job_site, job_description, job_completion, material_description, equipment_description,
            hours_worked, employee, straight_time, double_time, time_and_a_half,
            emergency_purchases, approved_by, shift_start_time, temperature_humidity, report_copy,
            manlifts_equipment, manlifts_fuel, delay_lost_time, employees_off, sub_contract
        ];

        const [results] = await pool.query(sql, values);
        console.log('Insert result:', results);
        res.status(201).json({ message: 'Daily report submitted successfully' });
    } catch (error) {
        console.error('Error inserting data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
