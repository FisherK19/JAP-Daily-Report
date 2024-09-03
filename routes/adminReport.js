const express = require('express');
const router = express.Router();
const { pool } = require('../config/connection');
const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');
const path = require('path');

// Helper function to add header to PDF documents
function addHeader(doc) {
    const logoPath = path.join(__dirname, '../assets/images/company-logo.png');
    doc.image(logoPath, { fit: [150, 150], align: 'center' });
    doc.moveDown(2);
    doc.fontSize(20).text('JOHN A. PAPALAS & COMPANY', { align: 'center' });
    doc.fontSize(12).text('Tel - 313-388-3000    Fax - 313-388-9864', { align: 'center' });
    doc.moveDown(2);
}

// Route for generating PDF report for a specific user and date
router.get('/report/pdf/:date/:user', async (req, res) => {
    const { date, user } = req.params;

    try {
        const [reports] = await pool.query('SELECT * FROM daily_reports WHERE date = ? AND username = ?', [date, user]);

        if (reports.length === 0) {
            return res.status(404).json({ message: 'No reports found for the specified date and user.' });
        }

        const doc = new PDFDocument({ margin: 50 });
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="report_${date}_${user}.pdf"`);
        doc.pipe(res);

        addHeader(doc);

        reports.forEach(report => {
            Object.keys(report).forEach(key => {
                doc.fontSize(12).text(`${key.toUpperCase()}: ${report[key]}`, { paragraphGap: 5 });
            });
            doc.addPage();
        });

        doc.end();
    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

// Route for generating Excel report for a specific user and date
router.get('/report/excel/:date/:user', async (req, res) => {
    const { date, user } = req.params;

    try {
        const [reports] = await pool.query('SELECT * FROM daily_reports WHERE date = ? AND username = ?', [date, user]);

        if (reports.length === 0) {
            return res.status(404).json({ message: 'No reports found for the specified date and user.' });
        }

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Daily Reports');

        worksheet.columns = [
            { header: 'ID', key: 'id', width: 10 },
            { header: 'Date', key: 'date', width: 15 },
            { header: 'Job Number', key: 'job_number', width: 15 },
            // Add other columns as needed
        ];

        reports.forEach(report => {
            worksheet.addRow(report);
        });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="report_${date}_${user}.xlsx"`);
        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error('Error generating Excel:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

module.exports = router;
