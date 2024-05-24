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
        doc.text(`T&M: ${report.t_and_m}`);
        doc.text(`Contract: ${report.contract}`);
        doc.text(`Foreman: ${report.foreman}`);
        doc.text(`Cell Number: ${report.cell_number}`);
        doc.text(`Customer: ${report.customer}`);
        doc.text(`Customer PO: ${report.customer_po}`);
        doc.text(`Job Site: ${report.job_site}`);
        doc.text(`Job Description: ${report.job_description}`);
        doc.text(`Job Completion: ${report.job_completion}`);
        doc.text(`Siding: ${report.siding}`);
        doc.text(`Roofing: ${report.roofing}`);
        doc.text(`Flashing: ${report.flashing}`);
        doc.text(`Miscellaneous: ${report.miscellaneous}`);
        doc.text(`Trucks: ${report.trucks}`);
        doc.text(`Welders: ${report.welders}`);
        doc.text(`Generators: ${report.generators}`);
        doc.text(`Compressors: ${report.compressors}`);
        doc.text(`Fuel: ${report.fuel}`);
        doc.text(`Scaffolding: ${report.scaffolding}`);
        doc.text(`Safety Equipment: ${report.safety_equipment}`);
        doc.text(`Miscellaneous Equipment: ${report.miscellaneous_equipment}`);
        doc.text(`Material Description: ${report.material_description}`);
        doc.text(`Equipment Description: ${report.equipment_description}`);
        doc.text(`Hours Worked: ${report.hours_worked}`);
        doc.text(`Employee: ${report.employee}`);
        doc.text(`Straight Time: ${report.straight_time}`);
        doc.text(`Time and a Half: ${report.time_and_a_half}`);
        doc.text(`Double Time: ${report.double_time}`);
        doc.text(`Emergency Purchases: ${report.emergency_purchases}`);
        doc.text(`Approved By: ${report.approved_by}`);
        doc.text(`Shift Start Time: ${report.shift_start_time}`);
        doc.text(`Temperature/Humidity: ${report.temperature_humidity}`);
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
        { header: 'T&M', key: 't_and_m', width: 15 },
        { header: 'Contract', key: 'contract', width: 15 },
        { header: 'Foreman', key: 'foreman', width: 15 },
        { header: 'Cell Number', key: 'cell_number', width: 15 },
        { header: 'Customer', key: 'customer', width: 15 },
        { header: 'Customer PO', key: 'customer_po', width: 15 },
        { header: 'Job Site', key: 'job_site', width: 15 },
        { header: 'Job Description', key: 'job_description', width: 30 },
        { header: 'Job Completion', key: 'job_completion', width: 15 },
        { header: 'Siding', key: 'siding', width: 15 },
        { header: 'Roofing', key: 'roofing', width: 15 },
        { header: 'Flashing', key: 'flashing', width: 15 },
        { header: 'Miscellaneous', key: 'miscellaneous', width: 15 },
        { header: 'Trucks', key: 'trucks', width: 15 },
        { header: 'Welders', key: 'welders', width: 15 },
        { header: 'Generators', key: 'generators', width: 15 },
        { header: 'Compressors', key: 'compressors', width: 15 },
        { header: 'Fuel', key: 'fuel', width: 15 },
        { header: 'Scaffolding', key: 'scaffolding', width: 15 },
        { header: 'Safety Equipment', key: 'safety_equipment', width: 15 },
        { header: 'Miscellaneous Equipment', key: 'miscellaneous_equipment', width: 15 },
        { header: 'Material Description', key: 'material_description', width: 30 },
        { header: 'Equipment Description', key: 'equipment_description', width: 30 },
        { header: 'Hours Worked', key: 'hours_worked', width: 15 },
        { header: 'Employee', key: 'employee', width: 15 },
        { header: 'Straight Time', key: 'straight_time', width: 15 },
        { header: 'Time and a Half', key: 'time_and_a_half', width: 15 },
        { header: 'Double Time', key: 'double_time', width: 15 },
        { header: 'Emergency Purchases', key: 'emergency_purchases', width: 30 },
        { header: 'Approved By', key: 'approved_by', width: 15 },
        { header: 'Shift Start Time', key: 'shift_start_time', width: 15 },
        { header: 'Temperature/Humidity', key: 'temperature_humidity', width: 30 },
        { header: 'Report Copy', key: 'report_copy', width: 15 }
    ];

    reports.forEach(report => {
        worksheet.addRow({
            date: report.date,
            job_number: report.job_number,
            t_and_m: report.t_and_m,
            contract: report.contract,
            foreman: report.foreman,
            cell_number: report.cell_number,
            customer: report.customer,
            customer_po: report.customer_po,
            job_site: report.job_site,
            job_description: report.job_description,
            job_completion: report.job_completion,
            siding: report.siding,
            roofing: report.roofing,
            flashing: report.flashing,
            miscellaneous: report.miscellaneous,
            trucks: report.trucks,
            welders: report.welders,
            generators: report.generators,
            compressors: report.compressors,
            fuel: report.fuel,
            scaffolding: report.scaffolding,
            safety_equipment: report.safety_equipment,
            miscellaneous_equipment: report.miscellaneous_equipment,
            material_description: report.material_description,
            equipment_description: report.equipment_description,
            hours_worked: report.hours_worked,
            employee: report.employee,
            straight_time: report.straight_time,
            time_and_a_half: report.time_and_a_half,
            double_time: report.double_time,
            emergency_purchases: report.emergency_purchases,
            approved_by: report.approved_by,
            shift_start_time: report.shift_start_time,
            temperature_humidity: report.temperature_humidity,
            report_copy: report.report_copy
        });
    });

    const excelPath = `user_${username}_reports.xlsx`;
    res.setHeader('Content-Disposition', `attachment; filename="${excelPath}"`);
    workbook.xlsx.write(res).then(() => {
        res.end();
        const adminEmail = process.env.EMAIL_ADDRESS;
        sendAlertEmail(adminEmail, username, excelPath, 'Excel');
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

        const adminEmail = process.env.EMAIL_ADDRESS;
        const pdfPath = `user_${username}_reports.pdf`;
        sendAlertEmail(adminEmail, username, pdfPath, 'PDF');
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
    } catch (error) {
        console.error('Error generating Excel:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
