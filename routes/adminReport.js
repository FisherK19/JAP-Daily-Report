const express = require('express');
const router = express.Router();
const { pool } = require('../config/connection');
const PDFDocument = require('pdfkit');
const path = require('path');

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
        res.setHeader('Content-Type', 'application/pdf');
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

        // Function to simulate a table row
        const addTableRow = (doc, key, value) => {
            doc.fontSize(10).text(key + ":", { continued: true, align: 'left', width: 240, indent: 40 })
               .text(value, { align: 'right', width: 240 });
            doc.moveDown(0.5);
        };

        // Manually creating a table-like structure
        ['Date', 'Job Number', 'T&M', 'Contract', 'Foreman', 'Cell Number', 'Customer',
         'Customer PO', 'Job Site', 'Job Description', 'Job Completion', 'Shift Start Time',
         'Temperature/Humidity', 'Equipment Description', 'Sheeting / Materials', 'Report Copy']
        .forEach(field => {
            if (report[field]) {
                addTableRow(doc, field, report[field].toString());
            }
        });

        doc.addPage(); // Adding a new page if needed for more data

        // Similar approach for additional data like equipment details or employee info
        // End the PDF stream
        doc.end();
    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

module.exports = router;
