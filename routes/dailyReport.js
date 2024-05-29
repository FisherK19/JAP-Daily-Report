const express = require('express');
const router = express.Router();
const { pool } = require('../config/connection');
const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');

// Ensure the reports directory exists
const reportsDir = path.join(__dirname, '../reports');
if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
}

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
            delay_lost_time, employees_off, sub_contract,
            employee_2_hours_worked, employee_2_name, employee_2_straight_time, employee_2_time_and_a_half, employee_2_double_time,
            employee_3_hours_worked, employee_3_name, employee_3_straight_time, employee_3_time_and_a_half, employee_3_double_time,
            employee_4_hours_worked, employee_4_name, employee_4_straight_time, employee_4_time_and_a_half, employee_4_double_time,
            employee_5_hours_worked, employee_5_name, employee_5_straight_time, employee_5_time_and_a_half, employee_5_double_time,
            employee_6_hours_worked, employee_6_name, employee_6_straight_time, employee_6_time_and_a_half, employee_6_double_time,
            employee_7_hours_worked, employee_7_name, employee_7_straight_time, employee_7_time_and_a_half, employee_7_double_time,
            employee_8_hours_worked, employee_8_name, employee_8_straight_time, employee_8_time_and_a_half, employee_8_double_time,
            employee_9_hours_worked, employee_9_name, employee_9_straight_time, employee_9_time_and_a_half, employee_9_double_time,
            employee_10_hours_worked, employee_10_name, employee_10_straight_time, employee_10_time_and_a_half, employee_10_double_time,
            employee_11_hours_worked, employee_11_name, employee_11_straight_time, employee_11_time_and_a_half, employee_11_double_time,
            employee_12_hours_worked, employee_12_name, employee_12_straight_time, employee_12_time_and_a_half, employee_12_double_time,
            employee_13_hours_worked, employee_13_name, employee_13_straight_time, employee_13_time_and_a_half, employee_13_double_time,
            employee_14_hours_worked, employee_14_name, employee_14_straight_time, employee_14_time_and_a_half, employee_14_double_time,
            employee_15_hours_worked, employee_15_name, employee_15_straight_time, employee_15_time_and_a_half, employee_15_double_time,
            employee_16_hours_worked, employee_16_name, employee_16_straight_time, employee_16_time_and_a_half, employee_16_double_time,
            employee_17_hours_worked, employee_17_name, employee_17_straight_time, employee_17_time_and_a_half, employee_17_double_time,
            employee_18_hours_worked, employee_18_name, employee_18_straight_time, employee_18_time_and_a_half, employee_18_double_time,
            employee_19_hours_worked, employee_19_name, employee_19_straight_time, employee_19_time_and_a_half, employee_19_double_time,
            employee_20_hours_worked, employee_20_name, employee_20_straight_time, employee_20_time_and_a_half, employee_20_double_time
        } = req.body;

        console.log('Form data:', req.body);

        // Define a field-value mapping
        const fieldValueMapping = {
            date, job_number, t_and_m: t_and_m ? 1 : 0, contract: contract ? 1 : 0, foreman, cell_number, customer, customer_po,
            job_site, job_description, job_completion, trucks, welders, generators, compressors, fuel, scaffolding, safety_equipment, miscellaneous_equipment,
            material_description, equipment_description, hours_worked, employee, straight_time, double_time, time_and_a_half,
            emergency_purchases, approved_by, shift_start_time, temperature_humidity, report_copy,
            manlifts_equipment, manlifts_fuel, delay_lost_time, employees_off, sub_contract, username,
            employee_2_hours_worked, employee_2_name, employee_2_straight_time, employee_2_time_and_a_half, employee_2_double_time,
            employee_3_hours_worked, employee_3_name, employee_3_straight_time, employee_3_time_and_a_half, employee_3_double_time,
            employee_4_hours_worked, employee_4_name, employee_4_straight_time, employee_4_time_and_a_half, employee_4_double_time,
            employee_5_hours_worked, employee_5_name, employee_5_straight_time, employee_5_time_and_a_half, employee_5_double_time,
            employee_6_hours_worked, employee_6_name, employee_6_straight_time, employee_6_time_and_a_half, employee_6_double_time,
            employee_7_hours_worked, employee_7_name, employee_7_straight_time, employee_7_time_and_a_half, employee_7_double_time,
            employee_8_hours_worked, employee_8_name, employee_8_straight_time, employee_8_time_and_a_half, employee_8_double_time,
            employee_9_hours_worked, employee_9_name, employee_9_straight_time, employee_9_time_and_a_half, employee_9_double_time,
            employee_10_hours_worked, employee_10_name, employee_10_straight_time, employee_10_time_and_a_half, employee_10_double_time,
            employee_11_hours_worked, employee_11_name, employee_11_straight_time, employee_11_time_and_a_half, employee_11_double_time,
            employee_12_hours_worked, employee_12_name, employee_12_straight_time, employee_12_time_and_a_half, employee_12_double_time,
            employee_13_hours_worked, employee_13_name, employee_13_straight_time, employee_13_time_and_a_half, employee_13_double_time,
            employee_14_hours_worked, employee_14_name, employee_14_straight_time, employee_14_time_and_a_half, employee_14_double_time,
            employee_15_hours_worked, employee_15_name, employee_15_straight_time, employee_15_time_and_a_half, employee_15_double_time,
            employee_16_hours_worked, employee_16_name, employee_16_straight_time, employee_16_time_and_a_half, employee_16_double_time,
            employee_17_hours_worked, employee_17_name, employee_17_straight_time, employee_17_time_and_a_half, employee_17_double_time,
            employee_18_hours_worked, employee_18_name, employee_18_straight_time, employee_18_time_and_a_half, employee_18_double_time,
            employee_19_hours_worked, employee_19_name, employee_19_straight_time, employee_19_time_and_a_half, employee_19_double_time,
            employee_20_hours_worked, employee_20_name, employee_20_straight_time, employee_20_time_and_a_half, employee_20_double_time
        };

        // Verify the number of fields and values
        const fields = Object.keys(fieldValueMapping);
        const values = Object.values(fieldValueMapping);

        console.log('Fields:', fields);
        console.log('Values:', values);

        // Ensure all columns are accounted for in the database
        const sql = `INSERT INTO daily_reports (${fields.join(', ')}) VALUES (${fields.map(() => '?').join(', ')})`;

        console.log('SQL Query:', sql);

        const [results] = await pool.query(sql, values);
        console.log('Insert result:', results);
        res.status(201).json({ message: 'Daily report submitted successfully' });
    } catch (error) {
        console.error('Error inserting data:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

module.exports = router;

