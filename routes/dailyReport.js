const express = require('express');
const router = express.Router();
const { pool } = require('../config/connection');
const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');

// Serve the daily report HTML
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'daily-report.html'));
});

// Route to handle daily report submission and generate PDF
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
            job_site, job_description, job_completion,
            trucks, welders, generators, compressors, fuel, scaffolding, safety_equipment, miscellaneous_equipment,
            material_description, equipment_description, hours_worked, employee, straight_time, double_time, time_and_a_half,
            emergency_purchases, approved_by, shift_start_time, temperature_humidity, report_copy,
            manlifts_equipment, manlifts_fuel, delay_lost_time, employees_off, sub_contract
        } = req.body;

        console.log('Form data:', req.body);

        // Create PDF
        const doc = new PDFDocument();
        const pdfPath = path.join(__dirname, '../reports', `report_${Date.now()}.pdf`);
        doc.pipe(fs.createWriteStream(pdfPath));

        // Add company logo
        const logoPath = path.join(__dirname, '../assets/images/company-logo.png');
        doc.image(logoPath, {
            fit: [150, 150],
            align: 'center'
        });

        doc.fontSize(18).text('JOHN A. PAPALAS & COMPANY', { align: 'center' });
        doc.fontSize(12).text('Tel - 313-388-3000    Fax - 313-388-9864', { align: 'center' });
        doc.moveDown();

        // Add report details
        doc.fontSize(12).text(`Date: ${new Date(date).toDateString()}`, { align: 'left' });
        doc.fontSize(12).text(`Job Number: ${job_number}`, { align: 'left' });
        doc.fontSize(12).text(`T&M: ${t_and_m ? 'Yes' : 'No'}`, { align: 'left' });
        doc.fontSize(12).text(`Contract: ${contract ? 'Yes' : 'No'}`, { align: 'left' });
        doc.fontSize(12).text(`Foreman: ${foreman}`, { align: 'left' });
        doc.fontSize(12).text(`Cell Number: ${cell_number}`, { align: 'left' });
        doc.fontSize(12).text(`Customer: ${customer}`, { align: 'left' });
        doc.fontSize(12).text(`Customer PO: ${customer_po}`, { align: 'left' });
        doc.fontSize(12).text(`Job Site: ${job_site}`, { align: 'left' });
        doc.fontSize(12).text(`Job Description: ${job_description}`, { align: 'left' });
        doc.fontSize(12).text(`Job Completion: ${job_completion}`, { align: 'left' });
        doc.fontSize(12).text(`Trucks: ${trucks}`, { align: 'left' });
        doc.fontSize(12).text(`Welders: ${welders}`, { align: 'left' });
        doc.fontSize(12).text(`Generators: ${generators}`, { align: 'left' });
        doc.fontSize(12).text(`Compressors: ${compressors}`, { align: 'left' });
        doc.fontSize(12).text(`Fuel: ${fuel}`, { align: 'left' });
        doc.fontSize(12).text(`Scaffolding: ${scaffolding}`, { align: 'left' });
        doc.fontSize(12).text(`Safety Equipment: ${safety_equipment}`, { align: 'left' });
        doc.fontSize(12).text(`Miscellaneous Equipment: ${miscellaneous_equipment}`, { align: 'left' });
        doc.fontSize(12).text(`Material Description: ${material_description}`, { align: 'left' });
        doc.fontSize(12).text(`Equipment Description: ${equipment_description}`, { align: 'left' });
        doc.fontSize(12).text(`Hours Worked: ${hours_worked}`, { align: 'left' });
        doc.fontSize(12).text(`Employee: ${employee}`, { align: 'left' });
        doc.fontSize(12).text(`Straight Time: ${straight_time}`, { align: 'left' });
        doc.fontSize(12).text(`Time and a Half: ${time_and_a_half}`, { align: 'left' });
        doc.fontSize(12).text(`Double Time: ${double_time}`, { align: 'left' });
        doc.fontSize(12).text(`Emergency Purchases: ${emergency_purchases}`, { align: 'left' });
        doc.fontSize(12).text(`Approved By: ${approved_by}`, { align: 'left' });
        doc.fontSize(12).text(`Shift Start Time: ${shift_start_time}`, { align: 'left' });
        doc.fontSize(12).text(`Temperature/Humidity: ${temperature_humidity}`, { align: 'left' });
        doc.fontSize(12).text(`Report Copy: ${report_copy}`, { align: 'left' });
        doc.fontSize(12).text(`Manlifts Equipment: ${manlifts_equipment}`, { align: 'left' });
        doc.fontSize(12).text(`Manlifts Fuel: ${manlifts_fuel}`, { align: 'left' });
        doc.fontSize(12).text(`Delay/Lost Time: ${delay_lost_time}`, { align: 'left' });
        doc.fontSize(12).text(`Employees Off: ${employees_off}`, { align: 'left' });
        doc.fontSize(12).text(`Sub-Contract: ${sub_contract}`, { align: 'left' });
        doc.fontSize(12).text(`Username: ${username}`, { align: 'left' });

        doc.end();

        // Insert data into the database
        const sql = `
            INSERT INTO daily_reports (
                date, job_number, t_and_m, contract, foreman, cell_number, customer, customer_po,
                job_site, job_description, job_completion,
                trucks, welders, generators, compressors, fuel, scaffolding, safety_equipment, miscellaneous_equipment,
                material_description, equipment_description, hours_worked, employee, straight_time, double_time, time_and_a_half,
                emergency_purchases, approved_by, shift_start_time, temperature_humidity, report_copy,
                manlifts_equipment, manlifts_fuel, delay_lost_time, employees_off, sub_contract, username
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            date, job_number, t_and_m ? 1 : 0, contract ? 1 : 0, foreman, cell_number, customer, customer_po,
            job_site, job_description, job_completion,
            trucks, welders, generators, compressors, fuel, scaffolding, safety_equipment, miscellaneous_equipment,
            material_description, equipment_description, hours_worked, employee, straight_time, double_time, time_and_a_half,
            emergency_purchases, approved_by, shift_start_time, temperature_humidity, report_copy,
            manlifts_equipment, manlifts_fuel, delay_lost_time, employees_off, sub_contract, username
        ];

        const [results] = await pool.query(sql, values);
        console.log('Insert result:', results);
        res.status(201).json({ message: 'Daily report submitted and PDF generated successfully', pdfPath });
    } catch (error) {
        console.error('Error inserting data:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

module.exports = router;

