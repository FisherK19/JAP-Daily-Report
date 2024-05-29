const express = require('express');
const router = express.Router();
const { pool } = require('../config/connection');

// Serve the daily report HTML
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'daily-report.html'));
});

// Route to handle daily report submission
router.post('/', async (req, res) => {
    try {
        console.log('Received a POST request');
        
        const user = req.session.user; // Retrieve user from session

        if (!user) {
            console.log('No user logged in');
            return res.status(401).json({ message: 'Unauthorized: No user logged in' });
        }

        const username = user.username;

        const {
            date, job_number, t_and_m, contract, foreman, cell_number, customer, customer_po,
            job_site, job_description, job_completion, trucks, welders, generators, compressors, fuel,
            scaffolding, safety_equipment, miscellaneous_equipment, material_description, equipment_description,
            hours_worked, employee, straight_time, double_time, time_and_a_half, emergency_purchases,
            approved_by, shift_start_time, temperature_humidity, report_copy, manlifts_equipment, manlifts_fuel,
            delay_lost_time, employees_off, sub_contract
        } = req.body;

        console.log('Form data:', req.body);

        // Ensure array fields are properly formatted
        const formattedHoursWorked = Array.isArray(hours_worked) ? hours_worked.join(', ') : hours_worked;
        const formattedEmployee = Array.isArray(employee) ? employee.join(', ') : employee;
        const formattedStraightTime = Array.isArray(straight_time) ? straight_time.join(', ') : straight_time;
        const formattedDoubleTime = Array.isArray(double_time) ? double_time.join(', ') : double_time;
        const formattedTimeAndAHalf = Array.isArray(time_and_a_half) ? time_and_a_half.join(', ') : time_and_a_half;

        // Define a field-value mapping
        const fieldValueMapping = {
            date, job_number, t_and_m: t_and_m ? 1 : 0, contract: contract ? 1 : 0, foreman, cell_number, customer, customer_po,
            job_site, job_description, job_completion, trucks, welders, generators, compressors, fuel, scaffolding, safety_equipment, miscellaneous_equipment,
            material_description, equipment_description, hours_worked: formattedHoursWorked, employee: formattedEmployee, straight_time: formattedStraightTime, double_time: formattedDoubleTime, time_and_a_half: formattedTimeAndAHalf,
            emergency_purchases, approved_by, shift_start_time, temperature_humidity, report_copy,
            manlifts_equipment, manlifts_fuel, delay_lost_time, employees_off, sub_contract, username
        };

        // Dynamically build the SQL query and values array
        const fields = Object.keys(fieldValueMapping).join(', ');
        const placeholders = Object.keys(fieldValueMapping).map(() => '?').join(', ');
        const values = Object.values(fieldValueMapping);

        const sql = `INSERT INTO daily_reports (${fields}) VALUES (${placeholders})`;

        console.log('SQL Query:', sql);
        console.log('Values:', values);

        const [results] = await pool.query(sql, values);
        console.log('Insert result:', results);
        res.status(201).json({ message: 'Daily report submitted successfully' });
    } catch (error) {
        console.error('Error inserting data:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

module.exports = router;

