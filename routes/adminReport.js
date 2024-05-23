const express = require('express');
const router = express.Router();
const { pool } = require('../config/connection');
const PDFDocument = require('pdfkit');
const nodemailer = require('nodemailer');
const ExcelJS = require('exceljs');
const fs = require('fs');

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
        doc.text(`Hours Worked: ${report.hours_worked}`);
        doc.text(`Employee: ${report.employee}`);
        doc.text(`Straight Time: ${report.straight_time}`);
        doc.text(`Time and a Half: ${report.time_and_a_half}`);
        doc.text(`Double Time: ${report.double_time}`);
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
        { header: 'Hours Worked', key: 'hours_worked', width: 15 },
        { header: 'Employee', key: 'employee', width: 15 },
        { header: 'Straight Time', key: 'straight_time', width: 15 },
        { header: 'Time and a Half', key: 'time_and_a_half', width: 15 },
        { header: 'Double Time', key: 'double_time', width: 15 }
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
