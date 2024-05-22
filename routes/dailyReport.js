const express = require('express');
const router = express.Router();
const { pool } = require('../config/connection');
const path = require('path');

// Serve the daily-report.html file
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'daily-report.html'));
});

// Route to submit a new daily report
router.post('/', (req, res) => {
    const {
        date, job_number, t_and_m, contract, foreman, cell_number, customer, customer_po,
        job_site, job_description, job_completion, siding, roofing, flashing, miscellaneous,
        trucks, welders, generators, compressors, fuel, scaffolding, safety_equipment, miscellaneous_equipment,
        hours_worked, employee, straight_time, double_time, time_and_a_half,
        emergency_purchases, approved_by, shift_start_time, temperature_humidity, report_copy,
        manlifts_equipment, manlifts_fuel, delay_lost_time, employees_off, sub_contract
    } = req.body;

    console.log('Received data:', req.body); // Log received data

    // Start a transaction
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting connection:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }

        connection.beginTransaction(err => {
            if (err) {
                connection.release();
                console.error('Error starting transaction:', err);
                return res.status(500).json({ message: 'Internal server error' });
            }

            const dailyReportSql = `
                INSERT INTO daily_reports (
                    date, job_number, t_and_m, contract, foreman, cell_number, customer, customer_po,
                    job_site, job_description, job_completion, siding, roofing, flashing, miscellaneous,
                    trucks, welders, generators, compressors, fuel, scaffolding, safety_equipment, miscellaneous_equipment,
                    emergency_purchases, approved_by, shift_start_time, temperature_humidity, report_copy,
                    manlifts_equipment, manlifts_fuel, delay_lost_time, employees_off, sub_contract
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            const dailyReportValues = [
                date, job_number, t_and_m ? 1 : 0, contract ? 1 : 0, foreman, cell_number, customer, customer_po,
                job_site, job_description, job_completion, siding, roofing, flashing, miscellaneous,
                trucks, welders, generators, compressors, fuel, scaffolding, safety_equipment, miscellaneous_equipment,
                emergency_purchases, approved_by, shift_start_time, temperature_humidity, report_copy,
                manlifts_equipment, manlifts_fuel, delay_lost_time, employees_off, sub_contract
            ];

            connection.query(dailyReportSql, dailyReportValues, (error, results) => {
                if (error) {
                    return connection.rollback(() => {
                        connection.release();
                        console.error('Error inserting daily report data:', error);
                        return res.status(500).json({ message: 'Internal server error' });
                    });
                }

                const dailyReportId = results.insertId;

                const employeeEntries = hours_worked.map((_, index) => [
                    dailyReportId,
                    hours_worked[index],
                    employee[index],
                    straight_time[index],
                    time_and_a_half[index],
                    double_time[index]
                ]);

                const employeeSql = `
                    INSERT INTO employee_entries (
                        daily_report_id, hours_worked, employee, straight_time, time_and_a_half, double_time
                    ) VALUES ?
                `;

                connection.query(employeeSql, [employeeEntries], (error) => {
                    if (error) {
                        return connection.rollback(() => {
                            connection.release();
                            console.error('Error inserting employee entries:', error);
                            return res.status(500).json({ message: 'Internal server error' });
                        });
                    }

                    connection.commit(err => {
                        if (err) {
                            return connection.rollback(() => {
                                connection.release();
                                console.error('Error committing transaction:', err);
                                return res.status(500).json({ message: 'Internal server error' });
                            });
                        }

                        connection.release();
                        res.status(201).json({ message: 'Daily report submitted successfully' });
                    });
                });
            });
        });
    });
});

module.exports = router;

