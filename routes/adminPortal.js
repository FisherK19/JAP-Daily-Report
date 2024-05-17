const express = require('express');
const path = require('path');
const { pool } = require('../config/connection');
const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');
const router = express.Router();

// Route for rendering the admin portal
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'adminportal.html'));
});

// Route for serving PDF reports for all daily reports
router.get('/report/pdf', (req, res) => {
    const { date } = req.query;
    const query = date ? 'SELECT * FROM daily_reports WHERE date = ?' : 'SELECT * FROM daily_reports';
    const queryParams = date ? [date] : [];

    pool.query(query, queryParams, (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        }

        const doc = new PDFDocument();
        res.setHeader('Content-disposition', 'attachment; filename=all_reports.pdf');
        res.setHeader('Content-type', 'application/pdf');
        doc.pipe(res);

        doc.fontSize(25).text('Daily Reports', { align: 'center' });
        results.forEach(report => {
            doc.fontSize(12).text(`Date: ${report.date}`);
            doc.fontSize(12).text(`Job Number: ${report.job_number}`);
            doc.fontSize(12).text(`Foreman: ${report.foreman}`);
            doc.fontSize(12).text(`Customer: ${report.customer}`);
            // Add other fields as needed
            doc.moveDown();
        });

        doc.end();
    });
});

// Route for serving Excel reports for all daily reports
router.get('/report/excel', (req, res) => {
    const { date } = req.query;
    const query = date ? 'SELECT * FROM daily_reports WHERE date = ?' : 'SELECT * FROM daily_reports';
    const queryParams = date ? [date] : [];

    pool.query(query, queryParams, (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        }

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Daily Reports');

        worksheet.columns = [
            { header: 'Date', key: 'date', width: 15 },
            { header: 'Job Number', key: 'job_number', width: 15 },
            { header: 'Foreman', key: 'foreman', width: 15 },
            { header: 'Customer', key: 'customer', width: 15 },
            // Add other columns as needed
        ];

        results.forEach(report => {
            worksheet.addRow({
                date: report.date,
                job_number: report.job_number,
                foreman: report.foreman,
                customer: report.customer,
                // Add other fields as needed
            });
        });

        res.setHeader('Content-disposition', 'attachment; filename=all_reports.xlsx');
        res.setHeader('Content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        
        workbook.xlsx.write(res).then(() => {
            res.end();
        });
    });
});

module.exports = router;
