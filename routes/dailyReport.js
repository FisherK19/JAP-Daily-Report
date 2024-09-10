const express = require('express');
const router = express.Router();
const path = require('path');
const { pool } = require('../config/connection');

// Helper function to handle array fields and fallback values
const formatField = (field, fallback = '0') => field || fallback;
const formatArrayField = (field) => Array.isArray(field) ? field.join(', ') : field;

// Route to handle daily report submission (no PDF generation here)
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
            hours_worked = [], employee = [], straight_time = [], double_time = [], time_and_a_half = [],
            emergency_purchases, approved_by, shift_start_time, temperature_humidity, report_copy,
            manlifts_equipment, manlifts_fuel, delay_lost_time, employees_off, sub_contract
        } = req.body;

        // Convert empty arrays or missing values to fallback values
        const formattedHoursWorked = formatArrayField(hours_worked) || '0';
        const formattedEmployee = formatArrayField(employee) || 'Unknown';
        const formattedStraightTime = formatArrayField(straight_time) || '0';
        const formattedDoubleTime = formatArrayField(double_time) || '0';
        const formattedTimeAndAHalf = formatArrayField(time_and_a_half) || '0';

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
            formattedHoursWorked, formattedEmployee, formattedStraightTime, formattedDoubleTime, formattedTimeAndAHalf, 
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
