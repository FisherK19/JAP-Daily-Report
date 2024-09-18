const express = require('express');
const router = express.Router();
const path = require('path');
const { pool } = require('../config/connection');

// Serve the daily report HTML
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'daily-report.html'));
});

// Helper function to format and ensure a default value for hours_worked
const formatField = (field, fallback = '0') => field || fallback;

// Route to handle daily report submission
router.post('/', async (req, res) => {
    try {
        const user = req.session.user;
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized: No user logged in' });
        }

        const username = user.username;
        const {
            date, job_number, t_and_m, contract, foreman, cell_number, customer, customer_po,
            job_site, job_description, job_completion, trucks, welders, generators, compressors, fuel,
            scaffolding, safety_equipment, miscellaneous_equipment, material_description, equipment_description,
            hours_worked, employee, straight_time, double_time, time_and_a_half,
            emergency_purchases, approved_by, shift_start_time, temperature_humidity, report_copy,
            manlifts_equipment, manlifts_fuel, delay_lost_time, employees_off, sub_contract
        } = req.body;

        // Ensure hours_worked has a valid value
        const formattedHoursWorked = formatField(hours_worked);
        const formatArrayField = (field) => Array.isArray(field) ? field.join(', ') : field || 'N/A'; // Default value if needed

        const formattedEmployee = formatArrayField(employee);
        // Insert the data into the database
        const sql = `
            INSERT INTO daily_reports (
                date, job_number, t_and_m, contract, foreman, cell_number, customer, customer_po, 
                job_site, job_description, job_completion, trucks, welders, generators, compressors, fuel, 
                scaffolding, safety_equipment, miscellaneous_equipment, material_description, equipment_description, 
                hours_worked, employee, straight_time, double_time, time_and_a_half, 
                emergency_purchases, approved_by, shift_start_time, temperature_humidity, report_copy, 
                manlifts_equipment, manlifts_fuel, delay_lost_time, employees_off, sub_contract, username
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            date, job_number, t_and_m ? 1 : 0, contract ? 1 : 0, foreman, cell_number, customer, customer_po, 
            job_site, job_description, job_completion, trucks, welders, generators, compressors, fuel, 
            scaffolding, safety_equipment, miscellaneous_equipment, material_description, equipment_description, 
            formattedHoursWorked, formattedEmployee, straight_time, double_time, time_and_a_half, 
            emergency_purchases, approved_by, shift_start_time, temperature_humidity, report_copy, 
            manlifts_equipment, manlifts_fuel, delay_lost_time, employees_off, sub_contract, username
        ];
        

        const [result] = await pool.query(sql, values);

        res.status(201).json({ message: 'Daily report submitted successfully' });
    } catch (error) {
        console.error('Error inserting data:', error.message);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});


module.exports = router;