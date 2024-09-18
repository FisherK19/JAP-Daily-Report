const express = require('express');
const router = express.Router();
const { pool } = require('../config/connection');
const puppeteer = require('puppeteer');

// Route to generate PDF report for a specific user and date
router.get('/pdf/:date/:user', async (req, res) => {
    try {
        const { date, user } = req.params;

        // Validate date and user
        if (!date || !user) {
            return res.status(400).json({ message: 'Date and user are required' });
        }

        // Fetch the report from the database
        const [reports] = await pool.query('SELECT * FROM daily_reports WHERE date = ? AND username = ?', [date, user]);

        if (reports.length === 0) {
            return res.status(404).json({ message: 'No report found for the specified date and user' });
        }

        const report = reports[0];

        // Launch Puppeteer and generate the PDF
        const browser = await puppeteer.launch({ headless: true, protocolTimeout: 500000 });
        const page = await browser.newPage();

        // Generate HTML content for the report
        const reportHTML = `
            <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; }
                        h1 { text-align: center; }
                        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                        th, td { padding: 8px; text-align: left; border: 1px solid #ddd; }
                    </style>
                </head>
                <body>
                    <h1>Daily Report for ${user} on ${new Date(report.date).toDateString()}</h1>
                    
                    <h3>Job Information</h3>
                    <table>
                        <tr><th>Job Number</th><td>${report.job_number}</td></tr>
                        <tr><th>Foreman</th><td>${report.foreman}</td></tr>
                        <tr><th>Job Site</th><td>${report.job_site}</td></tr>
                        <tr><th>Customer</th><td>${report.customer}</td></tr>
                        <tr><th>Customer PO</th><td>${report.customer_po}</td></tr>
                        <tr><th>Job Description</th><td>${report.job_description}</td></tr>
                        <tr><th>Job Completion</th><td>${report.job_completion}</td></tr>
                        <tr><th>Shift Start Time</th><td>${report.shift_start_time}</td></tr>
                        <tr><th>Temperature/Humidity</th><td>${report.temperature_humidity}</td></tr>
                        <tr><th>T&M</th><td>${report.t_and_m ? 'Yes' : 'No'}</td></tr>
                        <tr><th>Contract</th><td>${report.contract ? 'Yes' : 'No'}</td></tr>
                    </table>

                    <h3>Equipment Used</h3>
                    <table>
                        <tr><th>Trucks</th><td>${report.trucks}</td></tr>
                        <tr><th>Welders</th><td>${report.welders}</td></tr>
                        <tr><th>Generators</th><td>${report.generators}</td></tr>
                        <tr><th>Compressors</th><td>${report.compressors}</td></tr>
                        <tr><th>Fuel</th><td>${report.fuel}</td></tr>
                        <tr><th>Scaffolding</th><td>${report.scaffolding}</td></tr>
                        <tr><th>Safety Equipment</th><td>${report.safety_equipment}</td></tr>
                        <tr><th>Miscellaneous Equipment</th><td>${report.miscellaneous_equipment}</td></tr>
                        <tr><th>Material Description</th><td>${report.material_description}</td></tr>
                        <tr><th>Equipment Description</th><td>${report.equipment_description}</td></tr>
                        <tr><th>Manlifts Equipment</th><td>${report.manlifts_equipment}</td></tr>
                        <tr><th>Manlifts Fuel</th><td>${report.manlifts_fuel}</td></tr>
                    </table>

                    <h3>Employee Information</h3>
                    <table>
                        <tr><th>Employee Name</th><td>${report.employee}</td></tr>
                        <tr><th>Hours Worked</th><td>${report.hours_worked}</td></tr>
                        <tr><th>Straight Time</th><td>${report.straight_time}</td></tr>
                        <tr><th>Time and a Half</th><td>${report.time_and_a_half}</td></tr>
                        <tr><th>Double Time</th><td>${report.double_time}</td></tr>
                    </table>

                    <h3>Other Information</h3>
                    <table>
                        <tr><th>Emergency Purchases</th><td>${report.emergency_purchases}</td></tr>
                        <tr><th>Delay/Lost Time</th><td>${report.delay_lost_time}</td></tr>
                        <tr><th>Employees Off</th><td>${report.employees_off}</td></tr>
                        <tr><th>Subcontract</th><td>${report.sub_contract}</td></tr>
                        <tr><th>Approved By</th><td>${report.approved_by}</td></tr>
                        <tr><th>Report Copy</th><td>${report.report_copy}</td></tr>
                    </table>
                </body>
            </html>
        `;

        await page.setContent(reportHTML);

        // Generate the PDF
        const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });

        await browser.close();

        // Send the PDF as a response for download
        res.setHeader('Content-Disposition', `attachment; filename="report_${date}_${user}.pdf"`);
        res.setHeader('Content-Type', 'application/pdf');
        res.send(pdfBuffer);

    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

module.exports = router;

