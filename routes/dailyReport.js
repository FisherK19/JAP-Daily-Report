const express = require('express');
const router = express.Router();
const { pool } = require('../config/connection');
const path = require('path');
const PDFDocument = require('pdfkit');
const fs = require('fs');

// Serve the daily report HTML
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'daily-report.html'));
});

// Helper function to handle array fields and fallback values
const formatField = (field, fallback = '0') => field || fallback;
const formatArrayField = (field) => Array.isArray(field) ? field.join(', ') : field;

// Route to handle daily report submission and generate PDF
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

        // Convert array fields into strings or fallback to default values
        const formattedHoursWorked = formatArrayField(hours_worked) || '0';
        const formattedEmployee = formatArrayField(employee) || 'N/A';
        const formattedStraightTime = formatArrayField(straight_time) || '0';
        const formattedDoubleTime = formatArrayField(double_time) || '0';
        const formattedTimeAndAHalf = formatArrayField(time_and_a_half) || '0';

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

        // Ensure that the number of columns and values match
        console.log('SQL Query:', sql);
        console.log('Values:', values);

        const [results] = await pool.query(sql, values);
        console.log('Insert result:', results);

        // Create PDF after successful insertion
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

        // Add report details to the PDF
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
        doc.fontSize(12).text(`Hours Worked: ${formattedHoursWorked}`, { align: 'left' });
        doc.fontSize(12).text(`Employee: ${formattedEmployee}`, { align: 'left' });
        doc.fontSize(12).text(`Straight Time: ${formattedStraightTime}`, { align: 'left' });
        doc.fontSize(12).text(`Time and a Half: ${formattedTimeAndAHalf}`, { align: 'left' });
        doc.fontSize(12).text(`Double Time: ${formattedDoubleTime}`, { align: 'left' });
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

        res.status(201).json({ message: 'Daily report submitted and PDF generated successfully', pdfPath });

    } catch (error) {
        console.error('Error inserting data:', error.message);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

module.exports = router;
