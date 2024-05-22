const express = require('express');
const router = express.Router();
const { pool } = require('../config/connection');
const path = require('path');

// Serve the daily-report.html file
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'daily-report.html'));
});

// Route to submit a new daily report
router.post('/', async (req, res) => {
    const {
        date, job_number, t_and_m, contract, foreman, cell_number, customer, customer_po,
        job_site, job_description, job_completion, hours_worked, employee, straight_time, time_and_a_half, double_time,
        sheeting_materials, trucks, welders, generators, compressors, fuel, scaffolding, safety_equipment, miscellaneous_equipment,
        manlifts_equipment, manlifts_fuel, sub_contract, emergency_purchases, delay_lost_time, employees_off, temperature_humidity,
        approved_by, report_copy
    } = req.body;

    try {
        const sql = `
            INSERT INTO daily_reports (
                date, job_number, t_and_m, contract, foreman, cell_number, customer, customer_po, job_site, job_description,
                job_completion, hours_worked, employee, straight_time, time_and_a_half, double_time, sheeting_materials, trucks,
                welders, generators, compressors, fuel, scaffolding, safety_equipment, miscellaneous_equipment, manlifts_equipment,
                manlifts_fuel, sub_contract, emergency_purchases, delay_lost_time, employees_off, temperature_humidity,
                approved_by, report_copy
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            date, job_number, t_and_m ? 1 : 0, contract ? 1 : 0, foreman, cell_number, customer, customer_po, job_site, job_description,
            job_completion, hours_worked.join(','), employee.join(','), straight_time.join(','), time_and_a_half.join(','), double_time.join(','),
            sheeting_materials, trucks, welders, generators, compressors, fuel, scaffolding, safety_equipment, miscellaneous_equipment,
            manlifts_equipment, manlifts_fuel, sub_contract, emergency_purchases, delay_lost_time, employees_off, temperature_humidity,
            approved_by, report_copy
        ];

        await pool.query(sql, values);
        res.status(201).json({ message: 'Daily report submitted successfully' });
    } catch (error) {
        console.error('Error inserting data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
