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
        const username = req.session.username; // Retrieve username from session

        if (!username) {
            return res.status(401).json({ message: 'Unauthorized: No user logged in' });
        }

        const {
            date, job_number, t_and_m, contract, foreman, cell_number, customer, customer_po,
            job_site, job_description, job_completion, siding, roofing, flashing, miscellaneous,
            trucks, welders, generators, compressors, fuel, scaffolding, safety_equipment, miscellaneous_equipment,
            material_description, equipment_description, hours_worked, employee, straight_time, double_time, time_and_a_half,
            emergency_purchases, approved_by, shift_start_time, temperature_humidity, report_copy,
            manlifts_equipment, manlifts_fuel, delay_lost_time, employees_off, sub_contract
        } = req.body;

        console.log('Received data:', req.body);

        const sql = `
            INSERT INTO daily_reports (
                date, job_number, t_and_m, contract, foreman, cell_number, customer, customer_po,
                job_site, job_description, job_completion, siding, roofing, flashing, miscellaneous,
                trucks, welders, generators, compressors, fuel, scaffolding, safety_equipment, miscellaneous_equipment,
                material_description, equipment_description, hours_worked, employee, straight_time, double_time, time_and_a_half,
                emergency_purchases, approved_by, shift_start_time, temperature_humidity, report_copy,
                manlifts_equipment, manlifts_fuel, delay_lost_time, employees_off, sub_contract, username
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            date, job_number, t_and_m ? 1 : 0, contract ? 1 : 0, foreman, cell_number, customer, customer_po,
            job_site, job_description, job_completion, siding, roofing, flashing, miscellaneous,
            trucks, welders, generators, compressors, fuel, scaffolding, safety_equipment, miscellaneous_equipment,
            material_description, equipment_description, hours_worked, employee, straight_time, double_time, time_and_a_half,
            emergency_purchases, approved_by, shift_start_time, temperature_humidity, report_copy,
            manlifts_equipment, manlifts_fuel, delay_lost_time, employees_off, sub_contract, username
        ];

        const [results] = await pool.query(sql, values);
        console.log('Insert result:', results);
        res.status(201).json({ message: 'Daily report submitted successfully' });
    } catch (error) {
        console.error('Error inserting data:', error.message);
        console.error('Error details:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

module.exports = router;

