const express = require('express');
const router = express.Router();
const { pool } = require('../config/connection');
const path = require('path');
const rateLimit = require('express-rate-limit');

// Rate limiter to prevent abuse
const submitLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many submissions from this IP, please try again later.'
});

// Serve the daily report HTML
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'daily-report.html'));
});

// Helper function to format array fields for SQL insertion
const formatArrayField = (field) => Array.isArray(field) ? field.join(', ') : field;

// Route to handle daily report submission
router.post('/', submitLimiter, async (req, res) => {
    try {
        const user = req.session.user; // Retrieve user from session

        if (!user) {
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

        // Ensure all mandatory fields are present
        if (!date || !job_number || !foreman || !job_site) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Format array fields
        const formattedFields = {
            hours_worked: formatArrayField(hours_worked),
            employee: formatArrayField(employee),
            straight_time: formatArrayField(straight_time),
            double_time: formatArrayField(double_time),
            time_and_a_half: formatArrayField(time_and_a_half)
        };

        const fieldValueMapping = {
            date, job_number, t_and_m: t_and_m ? 1 : 0, contract: contract ? 1 : 0, foreman, cell_number, customer, customer_po,
            job_site, job_description, job_completion, trucks, welders, generators, compressors, fuel, scaffolding, safety_equipment, miscellaneous_equipment,
            material_description, equipment_description, ...formattedFields,
            emergency_purchases, approved_by, shift_start_time, temperature_humidity, report_copy,
            manlifts_equipment, manlifts_fuel, delay_lost_time, employees_off, sub_contract, username
        };

        // Dynamically build the SQL query and values array
        const fields = Object.keys(fieldValueMapping).join(', ');
        const placeholders = Object.keys(fieldValueMapping).map(() => '?').join(', ');
        const values = Object.values(fieldValueMapping);

        const sql = `INSERT INTO daily_reports (${fields}) VALUES (${placeholders})`;

        const [results] = await pool.query(sql, values);
        res.status(201).json({ message: 'Daily report submitted successfully', reportId: results.insertId });
    } catch (error) {
        console.error('Error inserting data:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

module.exports = router;


