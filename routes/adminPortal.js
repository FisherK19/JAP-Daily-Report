const express = require('express');
const router = express.Router();
const { pool } = require('../config/connection');
const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');
const path = require('path');

// Serve the admin portal HTML page
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/adminportal.html'));
});

// Route to fetch users for dropdown menu
router.get('/users', async (req, res) => {
    try {
        const [results] = await pool.query('SELECT DISTINCT username FROM users WHERE username IS NOT NULL AND username != ""');
        res.status(200).json(results);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Route for generating user-specific PDF report
router.get('/report/pdf/:date/:employee', async (req, res) => {
    const { date, employee } = req.params;

    if (!date || !employee) {
        return res.status(400).json({ message: 'Date and employee parameters are required.' });
    }

    try {
        const query = 'SELECT * FROM daily_reports WHERE date = ? AND employee = ?';
        const [results] = await pool.query(query, [date, employee]);

        if (results.length === 0) {
            return res.status(404).json({ message: 'No reports found for the user on the given date.' });
        }

        const doc = new PDFDocument({ margin: 50 });
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=${employee}_report_${date}.pdf`);

        doc.pipe(res);

        // Custom function to add header content
        addHeader(doc);

        // Add report content
        results.forEach(report => {
            // Example: Add report details
            doc.fontSize(14).text('Daily Report', { align: 'center' });
            doc.moveDown();
        });

        doc.end(); // Finalize the document and send the response
    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

// Helper function to add a header to the PDF document
function addHeader(doc) {
    const logoPath = path.join(__dirname, '../assets/images/company-logo.png');
    doc.image(logoPath, {
        fit: [150, 150],
        align: 'center'
    });
    doc.fontSize(20).text('Daily Reports', { align: 'center' });
    doc.moveDown();
}

// Similar routes for Excel report generation
router.get('/report/excel/:date/:employee', async (req, res) => {
    // Implementation of Excel report generation
});

module.exports = router;








