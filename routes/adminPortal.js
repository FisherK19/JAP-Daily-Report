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

// Route to fetch users for a specific date
router.get('/users/:date', (req, res) => {
    const { date } = req.params;
    console.log(`Fetching users for date: ${date}`); // Debug log
    pool.query('SELECT DISTINCT employee FROM daily_reports WHERE date = ?', [date], (error, results) => {
        if (error) {
            console.error('Error fetching users:', error); // Error log
            return res.status(500).json({ message: 'Internal server error' });
        }
        console.log('Users fetched:', results); // Debug log
        res.status(200).json(results);
    });
});

// Function to add the header on each page
function addHeader(doc) {
    // Add company logo with explicit position and size
    const logoPath = path.join(__dirname, '../assets/images/company-logo.png');
    doc.image(logoPath, {
        fit: [150, 150],
        align: 'center'
    });

    // Add more space after the logo to prevent overlap
    doc.moveDown(3);

    // Add header text
    doc.fontSize(20).text(`Daily Reports`, { align: 'center' });
    doc.moveDown(2);
}

// Route for generating user-specific PDF report
router.get('/report/pdf/:date/:employee', (req, res) => {
    const { date, employee } = req.params;
    pool.query('SELECT * FROM daily_reports WHERE date = ? AND employee = ?', [date, employee], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        }

        const doc = new PDFDocument({ margin: 50 });
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=${employee}_report_${date}.pdf`);
        doc.pipe(res);

        // Add header on the first page
        addHeader(doc);

        results.forEach(report => {
            // Define header style
            doc.fontSize(14).font('Helvetica-Bold');

            // Format the date to exclude the timestamp
            const formattedDate = new Date(report.date).toLocaleDateString('en-US', {
                weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
            });

            // Add report details with custom styling
            doc.text(`Date:`, { continued: true }).font('Helvetica').text(` ${formattedDate}`);
            doc.moveDown(0.5);
            doc.font('Helvetica-Bold').text(`Job Number:`, { continued: true }).font('Helvetica').text(` ${report.job_number}`);
            doc.moveDown(0.5);
            doc.font('Helvetica-Bold').text(`Foreman:`, { continued: true }).font('Helvetica').text(` ${report.foreman}`);
            doc.moveDown(0.5);
            doc.font('Helvetica-Bold').text(`Customer:`, { continued: true }).font('Helvetica').text(` ${report.customer}`);
            doc.moveDown(0.5);
            doc.font('Helvetica-Bold').text(`Customer PO:`, { continued: true }).font('Helvetica').text(` ${report.customer_po}`);
            doc.moveDown(0.5);
            doc.font('Helvetica-Bold').text(`Job Site:`, { continued: true }).font('Helvetica').text(` ${report.job_site}`);
            doc.moveDown(0.5);
            doc.font('Helvetica-Bold').text(`Job Description:`, { continued: true }).font('Helvetica').text(` ${report.job_description}`);
            doc.moveDown(0.5);
            doc.font('Helvetica-Bold').text(`Job Completion:`, { continued: true }).font('Helvetica').text(` ${report.job_completion}`);
            doc.moveDown(0.5);
            doc.font('Helvetica-Bold').text(`Material Description:`, { continued: true }).font('Helvetica').text(` ${report.material_description}`);
            doc.moveDown(0.5);
            doc.font('Helvetica-Bold').text(`Equipment Description:`, { continued: true }).font('Helvetica').text(` ${report.equipment_description}`);
            doc.moveDown(0.5);
            doc.font('Helvetica-Bold').text(`Hours Worked:`, { continued: true }).font('Helvetica').text(` ${report.hours_worked}`);
            doc.moveDown(0.5);
            doc.font('Helvetica-Bold').text(`Employee:`, { continued: true }).font('Helvetica').text(` ${report.employee}`);
            doc.moveDown(0.5);
            doc.font('Helvetica-Bold').text(`Straight Time:`, { continued: true }).font('Helvetica').text(` ${report.straight_time}`);
            doc.moveDown(0.5);
            doc.font('Helvetica-Bold').text(`Double Time:`, { continued: true }).font('Helvetica').text(` ${report.double_time}`);
            doc.moveDown(0.5);
            doc.font('Helvetica-Bold').text(`Time and 1/2:`, { continued: true }).font('Helvetica').text(` ${report.time_and_a_half}`);
            doc.moveDown(0.5);
            doc.font('Helvetica-Bold').text(`Emergency Purchases:`, { continued: true }).font('Helvetica').text(` ${report.emergency_purchases}`);
            doc.moveDown(0.5);
            doc.font('Helvetica-Bold').text(`Approved By:`, { continued: true }).font('Helvetica').text(` ${report.approved_by}`);
            doc.moveDown(2); // Add extra space between entries
        });

        // Add footer at the bottom of the first page
        const pageHeight = doc.page.height;
        const footerY = pageHeight - 50; // Position 50 units from the bottom
        doc.y = footerY; // Set the current position to the footerY value
        doc.fontSize(10).text('© 2024 John A. Pappalas Daily Report App. All rights reserved.', { align: 'center' });

        doc.end();
    });
});

// Route for generating user-specific Excel report
router.get('/report/excel/:date/:employee', (req, res) => {
    const { date, employee } = req.params;
    pool.query('SELECT * FROM daily_reports WHERE date = ? AND employee = ?', [date, employee], (error, results) => {
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
        res.setHeader('Content-Disposition', `attachment; filename=${employee}_report_${date}.xlsx`);

        workbook.xlsx.write(res).then(() => {
            res.end();
        });
    });
});

// Route for generating all reports as PDF for a specific date
router.get('/report/all/pdf/:date', (req, res) => {
    const { date } = req.params;
    pool.query('SELECT * FROM daily_reports WHERE date = ?', [date], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        }

        const doc = new PDFDocument({ margin: 50 });

        // Event listener for adding header on new pages
        doc.on('pageAdded', () => {
            addHeader(doc);
        });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=all_reports_${date}.pdf`);
        doc.pipe(res);

        // Add header on the first page
        addHeader(doc);

        let firstReport = true;

        results.forEach(report => {
            if (!firstReport) {
                doc.addPage(); // Add a page break between user reports
            } else {
                firstReport = false;
            }

            // Define header style
            doc.fontSize(14).font('Helvetica-Bold');

            // Format the date to exclude the timestamp
            const formattedDate = new Date(report.date).toLocaleDateString('en-US', {
                weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
            });

            // Add report details with custom styling
            doc.text(`Date:`, { continued: true }).font('Helvetica').text(` ${formattedDate}`);
            doc.moveDown(0.5);
            doc.font('Helvetica-Bold').text(`Job Number:`, { continued: true }).font('Helvetica').text(` ${report.job_number}`);
            doc.moveDown(0.5);
            doc.font('Helvetica-Bold').text(`Foreman:`, { continued: true }).font('Helvetica').text(` ${report.foreman}`);
            doc.moveDown(0.5);
            doc.font('Helvetica-Bold').text(`Customer:`, { continued: true }).font('Helvetica').text(` ${report.customer}`);
            doc.moveDown(0.5);
            doc.font('Helvetica-Bold').text(`Customer PO:`, { continued: true }).font('Helvetica').text(` ${report.customer_po}`);
            doc.moveDown(0.5);
            doc.font('Helvetica-Bold').text(`Job Site:`, { continued: true }).font('Helvetica').text(` ${report.job_site}`);
            doc.moveDown(0.5);
            doc.font('Helvetica-Bold').text(`Job Description:`, { continued: true }).font('Helvetica').text(` ${report.job_description}`);
            doc.moveDown(0.5);
            doc.font('Helvetica-Bold').text(`Job Completion:`, { continued: true }).font('Helvetica').text(` ${report.job_completion}`);
            doc.moveDown(0.5);
            doc.font('Helvetica-Bold').text(`Material Description:`, { continued: true }).font('Helvetica').text(` ${report.material_description}`);
            doc.moveDown(0.5);
            doc.font('Helvetica-Bold').text(`Equipment Description:`, { continued: true }).font('Helvetica').text(` ${report.equipment_description}`);
            doc.moveDown(0.5);
            doc.font('Helvetica-Bold').text(`Hours Worked:`, { continued: true }).font('Helvetica').text(` ${report.hours_worked}`);
            doc.moveDown(0.5);
            doc.font('Helvetica-Bold').text(`Employee:`, { continued: true }).font('Helvetica').text(` ${report.employee}`);
            doc.moveDown(0.5);
            doc.font('Helvetica-Bold').text(`Straight Time:`, { continued: true }).font('Helvetica').text(` ${report.straight_time}`);
            doc.moveDown(0.5);
            doc.font('Helvetica-Bold').text(`Double Time:`, { continued: true }).font('Helvetica').text(` ${report.double_time}`);
            doc.moveDown(0.5);
            doc.font('Helvetica-Bold').text(`Time and 1/2:`, { continued: true }).font('Helvetica').text(` ${report.time_and_a_half}`);
            doc.moveDown(0.5);
            doc.font('Helvetica-Bold').text(`Emergency Purchases:`, { continued: true }).font('Helvetica').text(` ${report.emergency_purchases}`);
            doc.moveDown(0.5);
            doc.font('Helvetica-Bold').text(`Approved By:`, { continued: true }).font('Helvetica').text(` ${report.approved_by}`);
            doc.moveDown(2); // Add extra space between entries
        });

        // Add footer at the bottom of the first page
        const pageHeight = doc.page.height;
        const footerY = pageHeight - 50; // Position 50 units from the bottom
        doc.y = footerY; // Set the current position to the footerY value
        doc.fontSize(10).text('© 2024 John A. Pappalas Daily Report App. All rights reserved.', { align: 'center' });

        doc.end();
    });
});

// Route for generating all reports as Excel for a specific date
router.get('/report/all/excel/:date', (req, res) => {
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
        res.setHeader('Content-Disposition', `attachment; filename=all_reports_${date}.xlsx`);

        workbook.xlsx.write(res).then(() => {
            res.end();
        });
    });
});

module.exports = router;









