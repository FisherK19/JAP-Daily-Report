const express = require('express');
const router = express.Router();
const { pool } = require('../config/connection');

router.post('/', async (req, res) => {
    try {
        const {
            date, job_number, t_and_m, contract, foreman, cell_number, customer,
            customer_po, job_site, job_description, job_completion, trucks,
            welders, generators, compressors, fuel, scaffolding, safety_equipment,
            miscellaneous_equipment, material_description, equipment_description,
            hours_worked, employee, straight_time, double_time, time_and_a_half,
            emergency_purchases, approved_by, shift_start_time, temperature_humidity,
            report_copy, manlifts_equipment, manlifts_fuel, delay_lost_time, employees_off,
            sub_contract, username
        } = req.body;

        const query = `
            INSERT INTO daily_reports (
                date, job_number, t_and_m, contract, foreman, cell_number, customer, customer_po,
                job_site, job_description, job_completion, trucks, welders, generators, compressors,
                fuel, scaffolding, safety_equipment, miscellaneous_equipment, material_description,
                equipment_description, hours_worked, employee, straight_time, double_time, time_and_a_half,
                emergency_purchases, approved_by, shift_start_time, temperature_humidity, report_copy,
                manlifts_equipment, manlifts_fuel, delay_lost_time, employees_off, sub_contract, username
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const values = [
            date, job_number, t_and_m, contract, foreman, cell_number, customer, customer_po,
            job_site, job_description, job_completion, trucks, welders, generators, compressors,
            fuel, scaffolding, safety_equipment, miscellaneous_equipment, material_description,
            equipment_description, hours_worked, employee, straight_time, double_time, time_and_a_half,
            emergency_purchases, approved_by, shift_start_time, temperature_humidity, report_copy,
            manlifts_equipment, manlifts_fuel, delay_lost_time, employees_off, sub_contract, username
        ];

        await pool.query(query, values);
        res.status(201).json({ message: 'Daily report submitted successfully' });
    } catch (error) {
        console.error('Error inserting data:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

module.exports = router;


