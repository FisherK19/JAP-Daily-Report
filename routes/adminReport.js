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
async function sendAlertEmail(adminEmail, username, reportPath, reportType) {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_ADDRESS,
            to: adminEmail,
            subject: `New ${reportType} Daily Report Downloaded`,
            html: `A new ${reportType} daily report has been downloaded for user ${username}.<br>Download Link: <a href="${reportPath}">${reportPath}</a>`
        });
        console.log('Email sent successfully.');
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

// Function to generate PDF report
function generatePDF(reports, username, res) {
    const doc = new PDFDocument({ margin: 30 });
    const pdfPath = `user_${username}_reports.pdf`;
    res.setHeader('Content-Disposition', `attachment; filename="${pdfPath}"`);
    doc.pipe(res);

    // Add company logo
    const logoPath = path.join(__dirname, '../assets/images/company-logo.png');
    doc.image(logoPath, {
        fit: [100, 100],
        align: 'center'
    });

    doc.moveDown(2); // Add some space after the logo

    // Add report title
    doc.fontSize(18).text('Daily Report', { align: 'center' });
    doc.moveDown();

    // Define table columns
    const table = {
        headers: [
            'Date', 'Job Number', 'T&M', 'Contract', 'Foreman', 'Cell Number', 'Customer', 'Customer PO',
            'Job Site', 'Job Description', 'Job Completion', 'Siding', 'Roofing', 'Flashing', 'Miscellaneous',
            'Trucks', 'Welders', 'Generators', 'Compressors', 'Fuel', 'Scaffolding', 'Safety Equipment',
            'Miscellaneous Equipment', 'Material Description', 'Equipment Description', 'Hours Worked',
            'Employee', 'Straight Time', 'Time and a Half', 'Double Time', 'Emergency Purchases', 'Approved By',
            'Shift Start Time', 'Temperature/Humidity', 'Report Copy'
        ],
        rows: []
    };

    // Add report data to table rows
    reports.forEach(report => {
        table.rows.push([
            report.date, report.job_number, report.t_and_m, report.contract, report.foreman, report.cell_number,
            report.customer, report.customer_po, report.job_site, report.job_description, report.job_completion,
            report.siding, report.roofing, report.flashing, report.miscellaneous, report.trucks, report.welders,
            report.generators, report.compressors, report.fuel, report.scaffolding, report.safety_equipment,
            report.miscellaneous_equipment, report.material_description, report.equipment_description,
            report.hours_worked, report.employee, report.straight_time, report.time_and_a_half, report.double_time,
            report.emergency_purchases, report.approved_by, report.shift_start_time, report.temperature_humidity,
            report.report_copy
        ]);
    });

    // Draw the table
    generateTable(doc, table);

    doc.end();
}

// Helper function to draw a table
function generateTable(doc, table) {
    const startX = doc.x;
    const startY = doc.y;

    // Draw table headers
    doc.fontSize(10).font('Helvetica-Bold');
    table.headers.forEach((header, i) => {
        doc.text(header, startX + i * 100, startY, { width: 100, align: 'center' });
    });

    doc.moveDown(1.5);

    // Draw table rows
    doc.fontSize(10).font('Helvetica');
    table.rows.forEach(row => {
        row.forEach((cell, i) => {
            doc.text(cell, startX + i * 100, doc.y, { width: 100, align: 'center' });
        });
        doc.moveDown();
    });
}

// Function to generate Excel report
async function generateExcel(reports, username, res) {
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
    await workbook.xlsx.write(res);
    res.end();

    const adminEmail = process.env.EMAIL_ADDRESS;
    await sendAlertEmail(adminEmail, username, excelPath, 'Excel');
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
        await sendAlertEmail(adminEmail, username, pdfPath, 'PDF');
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

        await generateExcel(reports, username, res);
    } catch (error) {
        console.error('Error generating Excel:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
