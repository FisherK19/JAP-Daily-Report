const express = require('express');
const router = express.Router();
const { pool } = require('../config/connection');
const PDFDocument = require('pdfkit');
const path = require('path');
require('pdfkit-table');

router.get('/pdf', async (req, res) => {
    try {
        const { date, user } = req.query;

        if (!date || !user) {
            return res.status(400).json({ message: 'Date and user are required' });
        }

        const [reports] = await pool.query('SELECT * FROM daily_reports WHERE date = ? AND username = ?', [date, user]);

        if (reports.length === 0) {
            return res.status(404).json({ message: 'No report found for the specified date and user' });
        }

        const report = reports[0];
        const doc = new PDFDocument({ margin: 30, size: 'A4' });
        const pdfPath = `daily_report_${date}_${user}.pdf`;
        res.setHeader('Content-Disposition', `attachment; filename="${pdfPath}"`);
        doc.pipe(res);

        // Add company logo
        const logoPath = path.join(__dirname, '../assets/images/company-logo.png');
        doc.image(logoPath, {
            fit: [150, 150],
            align: 'center'
        });

        doc.fontSize(18).text('JOHN A. PAPALAS & COMPANY', { align: 'center' });
        doc.fontSize(12).text('Tel - 313-388-3000    Fax - 313-388-9864', { align: 'center' });
        doc.moveDown();

        // Add report data to PDF
        doc.fontSize(16).text('Daily Report', { align: 'center' }).moveDown();

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
            { width: 400 }
        ).moveDown();

        doc.end();
    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

module.exports = router;

