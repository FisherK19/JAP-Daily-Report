const express = require('express');
const router = express.Router();
const { pool } = require('../config/connection');
const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');
const path = require('path');

function generatePDF(reports, username, res) {
    const doc = new PDFDocument({ margin: 30, size: 'A4' });
    const pdfPath = `user_${username}_reports.pdf`;
    res.setHeader('Content-Disposition', `attachment; filename="${pdfPath}"`);
    doc.pipe(res);

    // Header
    doc.image('assets/images/company-logo.png', 50, 45, { width: 70 })
        .fontSize(20)
        .text('JOHN A. PAPALAS & COMPANY', 110, 57)
        .fontSize(12)
        .text('Tel - 313-388-3000    Fax - 313-388-9864', 110, 77)
        .moveDown();

    doc.fontSize(16).text('Daily Report', { align: 'center' }).moveDown();

    // Content
    reports.forEach(report => {
        doc.moveDown()
            .fontSize(10)
            .text(`Date: ${new Date(report.date).toDateString()}`, { continued: true })
            .text(`Job Number: ${report.job_number}`, { align: 'right' })
            .text(`T&M: ${report.t_and_m ? 'Yes' : 'No'}`, { continued: true })
            .text(`Contract: ${report.contract ? 'Yes' : 'No'}`, { align: 'right' })
            .text(`Foreman: ${report.foreman}`, { continued: true })
            .text(`Cell Number: ${report.cell_number}`, { align: 'right' })
            .text(`Customer: ${report.customer}`, { continued: true })
            .text(`Customer PO: ${report.customer_po}`, { align: 'right' })
            .text(`Job Site: ${report.job_site}`, { continued: true })
            .text(`Job Completion: ${report.job_completion}`, { align: 'right' })
            .text(`Shift Start Time: ${report.shift_start_time}`, { continued: true })
            .text(`Temperature/Humidity: ${report.temperature_humidity}`, { align: 'right' })
            .moveDown()
            .text(`Job Description: ${report.job_description}`)
            .text(`Sheeting / Materials: ${report.material_description}`)
            .moveDown()
            .text('Employees:', { underline: true })
            .text(`Hours Worked: ${report.hours_worked}`)
            .text(`Employee: ${report.employee}`)
            .text(`Straight Time: ${report.straight_time}`)
            .text(`Time and a Half: ${report.time_and_a_half}`)
            .text(`Double Time: ${report.double_time}`)
            .moveDown()
            .text('Equipment:', { underline: true })
            .text(`Trucks: ${report.trucks}`)
            .text(`Welders: ${report.welders}`)
            .text(`Generators: ${report.generators}`)
            .text(`Compressors: ${report.compressors}`)
            .text(`Company Fuel: ${report.fuel}`)
            .text(`Scaffolding: ${report.scaffolding}`)
            .text(`Safety Equipment: ${report.safety_equipment}`)
            .text(`Miscellaneous Equipment: ${report.miscellaneous_equipment}`)
            .moveDown()
            .text('Manlifts / Rentals:', { underline: true })
            .text(`Manlifts Equipment: ${report.manlifts_equipment}`)
            .text(`Fuel: ${report.manlifts_fuel}`)
            .moveDown()
            .text('Sub-Contract:', { underline: true })
            .text(report.sub_contract)
            .moveDown()
            .text('Emergency Purchases:', { underline: true })
            .text(report.emergency_purchases)
            .moveDown()
            .text('Delay / Lost Time:', { underline: true })
            .text(report.delay_lost_time)
            .moveDown()
            .text('Employees Off:', { underline: true })
            .text(report.employees_off)
            .moveDown()
            .text('Approved By:', { underline: true })
            .text(report.approved_by)
            .moveDown()
            .text('Report Copy:', { underline: true })
            .text(report.report_copy)
            .moveDown()
            .text('---------------------------------------')
            .moveDown();
    });

    doc.end();
}

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
        { header: 'Report Copy', key: 'report_copy', width: 15 },
        { header: 'Trucks', key: 'trucks', width: 15 },
        { header: 'Welders', key: 'welders', width: 15 },
        { header: 'Generators', key: 'generators', width: 15 },
        { header: 'Compressors', key: 'compressors', width: 15 },
        { header: 'Fuel', key: 'fuel', width: 15 },
        { header: 'Scaffolding', key: 'scaffolding', width: 15 },
        { header: 'Safety Equipment', key: 'safety_equipment', width: 15 },
        { header: 'Miscellaneous Equipment', key: 'miscellaneous_equipment', width: 15 },
        { header: 'Manlifts Equipment', key: 'manlifts_equipment', width: 15 },
        { header: 'Manlifts Fuel', key: 'manlifts_fuel', width: 15 },
        { header: 'Sub-Contract', key: 'sub_contract', width: 30 },
        { header: 'Delay / Lost Time', key: 'delay_lost_time', width: 30 },
        { header: 'Employees Off', key: 'employees_off', width: 30 }
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
        
        console.log(`Fetched reports for user ${username}:`, reports); // Log query results
        console.log(`Total reports found: ${reports.length}`);

        if (reports.length === 0) {
            return res.status(404).json({ message: 'No reports found for the user.' });
        }

        generatePDF(reports, username, res);
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

