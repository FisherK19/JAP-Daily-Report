const express = require('express');
const router = express.Router();
const { pool } = require('../config/connection');
const PDFDocument = require('pdfkit');
const nodemailer = require('nodemailer');
const ExcelJS = require('exceljs');
const path = require('path');

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


function generatePDF(reports, username, res) {
    const doc = new PDFDocument({ margin: 30, size: 'A4' });
    const pdfPath = `user_${username}_reports.pdf`;
    res.setHeader('Content-Disposition', `attachment; filename="${pdfPath}"`);
    doc.pipe(res);

    // Header
    doc.image(path.join(__dirname, '../assets/images/company-logo.png'), { width: 50, align: 'center' })
        .fontSize(20)
        .text('JOHN A. PAPALAS & COMPANY', { align: 'center' })
        .fontSize(12)
        .text('Tel - 313-388-3000    Fax - 313-388-9864', { align: 'center' })
        .moveDown();

    doc.fontSize(16).text('Daily Report', { align: 'center' }).moveDown();

    // Table Header
    doc.fontSize(10);
    reports.forEach(report => {
        doc.text(`Date: ${new Date(report.date).toDateString()}`, 30)
            .text(`Job Number: ${report.job_number}`, 30)
            .text(`T&M: ${report.t_and_m ? 'Yes' : 'No'}`, 30)
            .text(`Contract: ${report.contract ? 'Yes' : 'No'}`, 30)
            .text(`Foreman: ${report.foreman}`, 30)
            .text(`Cell Number: ${report.cell_number}`, 30)
            .text(`Customer: ${report.customer}`, 30)
            .text(`Customer PO: ${report.customer_po}`, 30)
            .text(`Job Site: ${report.job_site}`, 30)
            .text(`Job Description: ${report.job_description}`, 30)
            .text(`Job Completion: ${report.job_completion}`, 30)
            .text(`Trucks: ${report.trucks}`, 30)
            .text(`Welders: ${report.welders}`, 30)
            .text(`Generators: ${report.generators}`, 30)
            .text(`Compressors: ${report.compressors}`, 30)
            .text(`Fuel: ${report.fuel}`, 30)
            .text(`Scaffolding: ${report.scaffolding}`, 30)
            .text(`Safety Equipment: ${report.safety_equipment}`, 30)
            .text(`Miscellaneous Equipment: ${report.miscellaneous_equipment}`, 30)
            .text(`Material Description: ${report.material_description}`, 30)
            .text(`Equipment Description: ${report.equipment_description}`, 30)
            .text(`Hours Worked: ${report.hours_worked}`, 30)
            .text(`Employee: ${report.employee}`, 30)
            .text(`Straight Time: ${report.straight_time}`, 30)
            .text(`Time and a Half: ${report.time_and_a_half}`, 30)
            .text(`Double Time: ${report.double_time}`, 30)
            .text(`Emergency Purchases: ${report.emergency_purchases}`, 30)
            .text(`Approved By: ${report.approved_by}`, 30)
            .text(`Shift Start Time: ${report.shift_start_time}`, 30)
            .text(`Temperature/Humidity: ${report.temperature_humidity}`, 30)
            .text(`Report Copy: ${report.report_copy}`, 30)
            .moveDown();

        if (doc.y > 700) {
            doc.addPage();
        }
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
        
        console.log(`Fetched reports for user ${username}:`, reports); // Log query results
        console.log(`Total reports found: ${reports.length}`);

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
        
        console.log(`Fetched reports for user ${username}:`, reports); // Log query results
        console.log(`Total reports found: ${reports.length}`);

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
