const express = require('express');
const router = express.Router();
const { pool } = require('../config/connection');
const PDFDocument = require('pdfkit');
const nodemailer = require('nodemailer');
const ExcelJS = require('exceljs');

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Function to send email alert with download link to report
function sendAlertEmail(adminEmail, username, reportPath, reportType) {
    const mailOptions = {
        from: process.env.EMAIL_ADDRESS,
        to: adminEmail,
        subject: `New ${reportType} Daily Report Downloaded`,
        html: `A new ${reportType} daily report has been downloaded for user ${username}.<br>Download Link: <a href="${reportPath}">${reportPath}</a>`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
}

// Function to generate PDF report
function generatePDF(reports, username, res) {
    const doc = new PDFDocument();
    const pdfPath = `user_${username}_reports.pdf`;
    res.setHeader('Content-Disposition', `attachment; filename="${pdfPath}"`);
    doc.pipe(res);

    reports.forEach(report => {
        doc.text(`Date: ${report.date}`);
        doc.text(`Job Number: ${report.job_number}`);
        doc.text(`Foreman: ${report.foreman}`);
        doc.text(`Cell Number: ${report.cell_number}`);
        doc.text(`Customer: ${report.customer}`);
        doc.text(`Customer PO: ${report.customer_po}`);
        doc.text(`Job Site: ${report.job_site}`);
        doc.text(`Job Description: ${report.job_description}`);
        doc.text(`Sheeting / Materials: ${report.materials}`);
        doc.text(`Hours Worked: ${report.hours_worked}`);
        doc.text(`Employee: ${report.employee}`);
        doc.text(`Straight Time: ${report.straight_time}`);
        doc.text(`Time and a Half: ${report.time_and_a_half}`);
        doc.text(`Double Time: ${report.double_time}`);
        doc.text(`Trucks: ${report.trucks}`);
        doc.text(`Welders: ${report.welders}`);
        doc.text(`Generators: ${report.generators}`);
        doc.text(`Compressors: ${report.compressors}`);
        doc.text(`Company Fuel: ${report.fuel}`);
        doc.text(`Scaffolding: ${report.scaffolding}`);
        doc.text(`Safety Equipment: ${report.safety_equipment}`);
        doc.text(`Miscellaneous: ${report.miscellaneous_equipment}`);
        doc.text(`Manlifts / Rentals: ${report.manlifts_equipment}`);
        doc.text(`Rental Fuel: ${report.manlifts_fuel}`);
        doc.text(`Sub-Contract: ${report.sub_contract}`);
        doc.text(`Emergency Purchases: ${report.emergency_purchases}`);
        doc.text(`Delay / Lost Time: ${report.delay_lost_time}`);
        doc.text(`Employees Off: ${report.employees_off}`);
        doc.text(`Temperature/Humidity: ${report.temperature_humidity}`);
        doc.text(`Approved By: ${report.approved_by}`);
        doc.text(`Report Copy: ${report.report_copy}`);
        doc.moveDown();
    });

    doc.end();
}

// Function to generate Excel report
function generateExcel(reports, username, res) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Daily Reports');

    worksheet.columns = [
        { header: 'Date', key: 'date', width: 15 },
        { header: 'Job Number', key: 'job_number', width: 15 },
        { header: 'Foreman', key: 'foreman', width: 15 },
        { header: 'Cell Number', key: 'cell_number', width: 15 },
        { header: 'Customer', key: 'customer', width: 15 },
        { header: 'Customer PO', key: 'customer_po', width: 15 },
        { header: 'Job Site', key: 'job_site', width: 15 },
        { header: 'Job Description', key: 'job_description', width: 30 },
        { header: 'Sheeting / Materials', key: 'materials', width: 30 },
        { header: 'Hours Worked', key: 'hours_worked', width: 15 },
        { header: 'Employee', key: 'employee', width: 15 },
        { header: 'Straight Time', key: 'straight_time', width: 15 },
        { header: 'Time and a Half', key: 'time_and_a_half', width: 15 },
        { header: 'Double Time', key: 'double_time', width: 15 },
        { header: 'Trucks', key: 'trucks', width: 15 },
        { header: 'Welders', key: 'welders', width: 15 },
        { header: 'Generators', key: 'generators', width: 15 },
        { header: 'Compressors', key: 'compressors', width: 15 },
        { header: 'Company Fuel', key: 'fuel', width: 15 },
        { header: 'Scaffolding', key: 'scaffolding', width: 15 },
        { header: 'Safety Equipment', key: 'safety_equipment', width: 15 },
        { header: 'Miscellaneous Equipment', key: 'miscellaneous_equipment', width: 15 },
        { header: 'Manlifts / Rentals', key: 'manlifts_equipment', width: 15 },
        { header: 'Rental Fuel', key: 'manlifts_fuel', width: 15 },
        { header: 'Sub-Contract', key: 'sub_contract', width: 30 },
        { header: 'Emergency Purchases', key: 'emergency_purchases', width: 30 },
        { header: 'Delay / Lost Time', key: 'delay_lost_time', width: 30 },
        { header: 'Employees Off', key: 'employees_off', width: 30 },
        { header: 'Temperature/Humidity', key: 'temperature_humidity', width: 30 },
        { header: 'Approved By', key: 'approved_by', width: 15 },
        { header: 'Report Copy', key: 'report_copy', width: 15 }
    ];

    reports.forEach(report => {
        worksheet.addRow(report);
    });

    const excelPath = `user_${username}_reports.xlsx`;
    res.setHeader('Content-Disposition', `attachment; filename="${excelPath}"`);

    workbook.xlsx.write(res).then(() => {
        res.end();
    });
}

// Route to generate and download PDF report for a specific user
router.get('/pdf/:username', async (req, res) => {
    const { username } = req.params;

    try {
        const [reports] = await pool.query('SELECT * FROM daily_reports WHERE username = ?', [username]);

        if (reports.length === 0) {
            return res.status(404).json({ message: 'No reports found for the user.' });
        }

        generatePDF(reports, username, res);
        sendAlertEmail(process.env.EMAIL_ADDRESS, username, `/path/to/pdf/${pdfPath}`, 'PDF');
    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Route to generate and download Excel report for a specific user
router.get('/excel/:username', async (req, res) => {
    const { username } = req.params;

    try {
        const [reports] = await pool.query('SELECT * FROM daily_reports WHERE username = ?', [username]);

        if (reports.length === 0) {
            return res.status(404).json({ message: 'No reports found for the user.' });
        }

        generateExcel(reports, username, res);
        sendAlertEmail(process.env.EMAIL_ADDRESS, username, `/path/to/excel/${excelPath}`, 'Excel');
    } catch (error) {
        console.error('Error generating Excel:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
