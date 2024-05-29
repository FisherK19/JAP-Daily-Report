const express = require('express');
const router = express.Router();
const { pool } = require('../config/connection');
const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');
const path = require('path');
require('pdfkit-table');

// Function to generate PDF report
function generatePDF(reports, username, res) {
    const doc = new PDFDocument({ margin: 30, size: 'A4' });
    const pdfPath = `user_${username}_reports.pdf`;
    res.setHeader('Content-Disposition', `attachment; filename="${pdfPath}"`);
    doc.pipe(res);

    // Header
    doc.image(path.join(__dirname, '../assets/images/company-logo.png'), { width: 100, align: 'center' })
        .fontSize(20)
        .text('JOHN A. PAPALAS & COMPANY', { align: 'center' })
        .fontSize(12)
        .text('Tel - 313-388-3000    Fax - 313-388-9864', { align: 'center' })
        .moveDown();

    doc.fontSize(16).text('Daily Report', { align: 'center' }).moveDown();

    reports.forEach((report, index) => {
        console.log(`Processing report ${index + 1} of ${reports.length}`);
        doc.fontSize(10);

        // Main information table
        const mainInfoTable = [
            ['Date', new Date(report.date).toDateString()],
            ['Job Number', report.job_number],
            ['T&M', report.t_and_m ? 'Yes' : 'No'],
            ['Contract', report.contract ? 'Yes' : 'No'],
            ['Foreman', report.foreman],
            ['Cell Number', report.cell_number],
            ['Customer', report.customer],
            ['Customer PO', report.customer_po],
            ['Job Site', report.job_site],
            ['Job Description', report.job_description],
            ['Job Completion', report.job_completion],
            ['Shift Start Time', report.shift_start_time],
            ['Temperature/Humidity', report.temperature_humidity],
            ['Equipment Description', report.equipment_description],
            ['Sheeting / Materials', report.material_description],
            ['Report Copy', report.report_copy]
        ];

        doc.table({ headers: ['Key', 'Value'], rows: mainInfoTable }, { width: 500 }).moveDown();

        // Equipment table
        const equipmentTable = [
            ['Trucks', report.trucks],
            ['Welders', report.welders],
            ['Generators', report.generators],
            ['Compressors', report.compressors],
            ['Company Fuel', report.fuel],
            ['Scaffolding', report.scaffolding],
            ['Safety Equipment', report.safety_equipment],
            ['Miscellaneous Equipment', report.miscellaneous_equipment]
        ];

        doc.fontSize(12).text('Equipment:', { underline: true }).moveDown(0.5);
        doc.table({ headers: ['Equipment', 'Count'], rows: equipmentTable }, { width: 400 }).moveDown();

        // Employees table
        const employeesTable = [
            [
                report.employee,
                report.hours_worked,
                report.straight_time,
                report.time_and_a_half,
                report.double_time
            ]
        ];

        doc.fontSize(12).text('Employees:', { underline: true }).moveDown(0.5);
        doc.table(
            { headers: ['Employee', 'Hours Worked', 'Straight Time', 'Time and a Half', 'Double Time'], rows: employeesTable },
            { width: 500 }
        ).moveDown(2);

        // Other details
        const otherDetailsTable = [
            ['Sub-Contract', report.sub_contract],
            ['Emergency Purchases', report.emergency_purchases],
            ['Delay / Lost Time', report.delay_lost_time],
            ['Employees Off', report.employees_off],
            ['Approved By', report.approved_by]
        ];

        doc.table({ headers: ['Key', 'Value'], rows: otherDetailsTable }, { width: 500 }).moveDown(2);
    });

    doc.end();
}

// Route to generate and download PDF report for a specific user
router.get('/pdf/:username', (req, res) => {
    const username = req.params.username;

    pool.query('SELECT * FROM daily_reports WHERE username = ?', [username], (error, results) => {
        if (error) {
            console.error('Error fetching reports:', error);
            return res.status(500).send('Error fetching reports');
        }

        if (results.length === 0) {
            return res.status(404).send('No reports found for this user');
        }

        generatePDF(results, username, res);
    });
});

module.exports = router;
