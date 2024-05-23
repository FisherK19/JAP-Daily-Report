const express = require('express');
const router = express.Router();
const { pool } = require('../config/connection');
const PDFDocument = require('pdfkit');
const excel = require('exceljs');
const path = require('path');

// Serve the admin portal page
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/adminportal.html'));
});

// Route to fetch users for a specific date
router.get('/users', async (req, res) => {
    try {
        const [results] = await pool.query('SELECT DISTINCT username FROM users WHERE username IS NOT NULL AND username != ""');
        res.status(200).json(results);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Function to add the header on each page
function addHeader(doc) {
    const logoPath = path.join(__dirname, '../assets/images/company-logo.png');
    doc.image(logoPath, {
        fit: [150, 150],
        align: 'center'
    });
    doc.moveDown(3);
    doc.fontSize(20).text('Daily Reports', { align: 'center' });
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

        addHeader(doc);

        results.forEach(report => {
            doc.fontSize(14).font('Helvetica-Bold').text('Daily Report', { align: 'center' });
            doc.moveDown(1);

            doc.fontSize(12).font('Helvetica-Bold').text('JOHN A. PAPALAS & COMPANY', { continued: true }).text('Date: ', { continued: true }).font('Helvetica').text(report.date);
            doc.moveDown(0.5);
            doc.font('Helvetica-Bold').text('Tel - 313-388-3000    Fax - 313-388-9864', { continued: true }).text('Job #: ', { continued: true }).font('Helvetica').text(report.job_number);
            doc.moveDown(1);

            doc.font('Helvetica-Bold').text('Foreman: ', { continued: true }).font('Helvetica').text(report.foreman, { continued: true }).font('Helvetica-Bold').text('    T&M: ', { continued: true }).font('Helvetica').text(report.t_and_m ? 'Yes' : 'No', { continued: true }).font('Helvetica-Bold').text('    Contract: ', { continued: true }).font('Helvetica').text(report.contract ? 'Yes' : 'No');
            doc.moveDown(0.5);
            doc.font('Helvetica-Bold').text('Cellular #: ', { continued: true }).font('Helvetica').text(report.cell_number, { continued: true }).font('Helvetica-Bold').text('    Job Completion %: ', { continued: true }).font('Helvetica').text(report.job_completion);
            doc.moveDown(0.5);
            doc.font('Helvetica-Bold').text('Customer: ', { continued: true }).font('Helvetica').text(report.customer, { continued: true }).font('Helvetica-Bold').text('    Shift/Start Time: ', { continued: true }).font('Helvetica').text(report.shift_start_time);
            doc.moveDown(0.5);
            doc.font('Helvetica-Bold').text('Customer PO #: ', { continued: true }).font('Helvetica').text(report.customer_po);
            doc.moveDown(0.5);
            doc.font('Helvetica-Bold').text('Job Site: ', { continued: true }).font('Helvetica').text(report.job_site);
            doc.moveDown(0.5);
            doc.font('Helvetica-Bold').text('Job Description: ', { continued: true }).font('Helvetica').text(report.job_description);
            doc.moveDown(0.5);
            doc.font('Helvetica-Bold').text('Sheeting/Materials: ', { continued: true }).font('Helvetica').text(report.material_description);
            doc.moveDown(1);

            doc.fontSize(12).font('Helvetica-Bold').text('Employees:', { align: 'left' });
            doc.moveDown(0.5);
            doc.fontSize(10).font('Helvetica-Bold').text('Hours Worked   Employee   Straight   Time & 1/2   Double Time');
            doc.moveDown(0.5);
            doc.font('Helvetica').text(`${report.hours_worked}   ${report.employee}   ${report.straight_time}   ${report.time_and_a_half}   ${report.double_time}`);
            doc.moveDown(1);

            doc.fontSize(12).font('Helvetica-Bold').text('Equipment:', { align: 'left' });
            doc.moveDown(0.5);
            doc.fontSize(10).font('Helvetica-Bold').text('Trucks: ', { continued: true }).font('Helvetica').text(report.trucks, { continued: true }).font('Helvetica-Bold').text('   Welders: ', { continued: true }).font('Helvetica').text(report.welders, { continued: true }).font('Helvetica-Bold').text('   Generators: ', { continued: true }).font('Helvetica').text(report.generators);
            doc.moveDown(0.5);
            doc.font('Helvetica-Bold').text('Compressors: ', { continued: true }).font('Helvetica').text(report.compressors, { continued: true }).font('Helvetica-Bold').text('   Fuel: ', { continued: true }).font('Helvetica').text(report.fuel, { continued: true }).font('Helvetica-Bold').text('   Scaffolding: ', { continued: true }).font('Helvetica').text(report.scaffolding);
            doc.moveDown(0.5);
            doc.font('Helvetica-Bold').text('Safety Equipment: ', { continued: true }).font('Helvetica').text(report.safety_equipment, { continued: true }).font('Helvetica-Bold').text('   Miscellaneous: ', { continued: true }).font('Helvetica').text(report.miscellaneous_equipment);
            doc.moveDown(1);

            doc.fontSize(12).font('Helvetica-Bold').text('Sub-Contract:', { align: 'left' });
            doc.moveDown(0.5);
            doc.fontSize(10).font('Helvetica').text(report.sub_contract);
            doc.moveDown(1);

            doc.fontSize(12).font('Helvetica-Bold').text('Emergency Purchases:', { align: 'left' });
            doc.moveDown(0.5);
            doc.fontSize(10).font('Helvetica').text(report.emergency_purchases);
            doc.moveDown(1);

            doc.fontSize(12).font('Helvetica-Bold').text('Delay/Lost Time:', { align: 'left' });
            doc.moveDown(0.5);
            doc.fontSize(10).font('Helvetica').text(report.delay_lost_time);
            doc.moveDown(1);

            doc.fontSize(12).font('Helvetica-Bold').text('Employees Off:', { align: 'left' });
            doc.moveDown(0.5);
            doc.fontSize(10).font('Helvetica').text(report.employees_off);
            doc.moveDown(1);

            doc.fontSize(12).font('Helvetica-Bold').text('Temperature/Humidity:', { align: 'left' });
            doc.moveDown(0.5);
            doc.fontSize(10).font('Helvetica').text(report.temperature_humidity);
            doc.moveDown(1);

            doc.fontSize(12).font('Helvetica-Bold').text('Approved By:', { align: 'left' });
            doc.moveDown(0.5);
            doc.fontSize(10).font('Helvetica').text(report.approved_by);
            doc.moveDown(1);

            doc.fontSize(12).font('Helvetica-Bold').text('Report Copy:', { align: 'left' });
            doc.moveDown(0.5);
            doc.fontSize(10).font('Helvetica').text(report.report_copy);
            doc.moveDown(2);
        });

        const pageHeight = doc.page.height;
        const footerY = pageHeight - 50;
        doc.y = footerY;
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

        doc.on('pageAdded', () => {
            addHeader(doc);
        });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=all_reports_${date}.pdf`);
        doc.pipe(res);

        addHeader(doc);

        let firstReport = true;

        results.forEach(report => {
            if (!firstReport) {
                doc.addPage();
            } else {
                firstReport = false;
            }

            doc.fontSize(14).font('Helvetica-Bold');

            const formattedDate = new Date(report.date).toLocaleDateString('en-US', {
                weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
            });

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
            doc.moveDown(2);
        });

        const pageHeight = doc.page.height;
        const footerY = pageHeight - 50;
        doc.y = footerY;
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






