const express = require('express');
const router = express.Router();
const { pool } = require('../config/connection');
const path = require('path');
const PDFDocument = require('pdfkit');
const excel = require('exceljs');

// Serve the admin portal page
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/adminportal.html'));
});

// Route for generating PDF report
router.get('/report/pdf/:date', (req, res) => {
    const { date } = req.params;
    pool.query('SELECT * FROM daily_reports WHERE date = ?', [date], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        }

        // Create a PDF document
        const doc = new PDFDocument();
        res.setHeader('Content-Type', 'application/pdf');
        doc.pipe(res);

        doc.fontSize(25).text('Daily Report', { align: 'center' });

        results.forEach(report => {
            doc.fontSize(12).text(`Date: ${report.date}`);
            doc.fontSize(12).text(`Job Number: ${report.job_number}`);
            doc.fontSize(12).text(`Foreman: ${report.foreman}`);
            doc.fontSize(12).text(`Customer: ${report.customer}`);
            doc.fontSize(12).text(`Customer PO: ${report.customer_po}`);
            doc.fontSize(12).text(`Job Site: ${report.job_site}`);
            doc.fontSize(12).text(`Job Description: ${report.job_description}`);
            doc.fontSize(12).text(`Job Completion: ${report.job_completion}`);
            doc.fontSize(12).text(`Material Description: ${report.material_description}`);
            doc.fontSize(12).text(`Equipment Description: ${report.equipment_description}`);
            doc.fontSize(12).text(`Hours Worked: ${report.hours_worked}`);
            doc.fontSize(12).text(`Employee: ${report.employee}`);
            doc.fontSize(12).text(`Straight Time: ${report.straight_time}`);
            doc.fontSize(12).text(`Double Time: ${report.double_time}`);
            doc.fontSize(12).text(`Time and 1/2: ${report.time_and_a_half}`);
            doc.fontSize(12).text(`Emergency Purchases: ${report.emergency_purchases}`);
            doc.fontSize(12).text(`Approved By: ${report.approved_by}`);
            doc.moveDown();
        });

        doc.end();
    });
});

// Route for generating Excel report
router.get('/report/excel/:date', (req, res) => {
    const { date } = req.params;
    pool.query('SELECT * FROM daily_reports WHERE date = ?', [date], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        }

        const workbook = new excel.Workbook();
        const worksheet = workbook.addWorksheet('Daily Reports');

        worksheet.columns = [
            { header: 'Date', key: 'date', width: 15 },
            { header: 'Job Number', key: 'job_number', width: 15 },
            { header: 'Foreman', key: 'foreman', width: 15 },
            { header: 'Customer', key: 'customer', width: 15 },
            { header: 'Customer PO', key: 'customer_po', width: 15 },
            { header: 'Job Site', key: 'job_site', width: 15 },
            { header: 'Job Description', key: 'job_description', width: 15 },
            { header: 'Job Completion', key: 'job_completion', width: 15 },
            { header: 'Material Description', key: 'material_description', width: 20 },
            { header: 'Equipment Description', key: 'equipment_description', width: 20 },
            { header: 'Hours Worked', key: 'hours_worked', width: 15 },
            { header: 'Employee', key: 'employee', width: 15 },
            { header: 'Straight Time', key: 'straight_time', width: 15 },
            { header: 'Double Time', key: 'double_time', width: 15 },
            { header: 'Time and 1/2', key: 'time_and_a_half', width: 15 },
            { header: 'Emergency Purchases', key: 'emergency_purchases', width: 20 },
            { header: 'Approved By', key: 'approved_by', width: 15 }
        ];

        results.forEach(report => {
            worksheet.addRow({
                date: report.date,
                job_number: report.job_number,
                foreman: report.foreman,
                customer: report.customer,
                customer_po: report.customer_po,
                job_site: report.job_site,
                job_description: report.job_description,
                job_completion: report.job_completion,
                material_description: report.material_description,
                equipment_description: report.equipment_description,
                hours_worked: report.hours_worked,
                employee: report.employee,
                straight_time: report.straight_time,
                double_time: report.double_time,
                time_and_a_half: report.time_and_a_half,
                emergency_purchases: report.emergency_purchases,
                approved_by: report.approved_by
            });
        });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=daily_reports_${date}.xlsx`);

        workbook.xlsx.write(res).then(() => {
            res.end();
        });
    });
});

module.exports = router;
