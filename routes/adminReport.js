const express = require('express');
const router = express.Router();
const { pool } = require('../config/connection');
const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');
const path = require('path');

// Function to generate PDF report
function generatePDF(reports, username, res) {
    const doc = new PDFDocument({ margin: 30, size: 'A4' });
    const pdfPath = `user_${username}_reports.pdf`;
    res.setHeader('Content-Disposition', `attachment; filename="${pdfPath}"`);
    doc.pipe(res);

    // Header
    doc.image(path.join(__dirname, '../assets/images/company-logo.png'), { width: 80, align: 'center' })
        .fontSize(20)
        .text('JOHN A. PAPALAS & COMPANY', { align: 'center' })
        .fontSize(12)
        .text('Tel - 313-388-3000    Fax - 313-388-9864', { align: 'center' })
        .moveDown();

    doc.fontSize(16).text('Daily Report', { align: 'center' }).moveDown();

    reports.forEach(report => {
        // Job Details Section
        doc.fontSize(12).text(`Date: ${new Date(report.date).toDateString()}`, { align: 'left' })
            .text(`Job Number: ${report.job_number}`, { align: 'right' })
            .moveDown(0.5);
        doc.text(`T&M: ${report.t_and_m ? 'Yes' : 'No'}`, { align: 'left' })
            .text(`Contract: ${report.contract ? 'Yes' : 'No'}`, { align: 'right' })
            .moveDown(0.5);
        doc.text(`Foreman: ${report.foreman}`, { align: 'left' })
            .text(`Cell Number: ${report.cell_number}`, { align: 'right' })
            .moveDown(0.5);
        doc.text(`Customer: ${report.customer}`, { align: 'left' })
            .text(`Customer PO: ${report.customer_po}`, { align: 'right' })
            .moveDown(0.5);
        doc.text(`Job Site: ${report.job_site}`, { align: 'left' })
            .text(`Job Completion: ${report.job_completion}`, { align: 'right' })
            .moveDown(0.5);
        doc.text(`Job Description: ${report.job_description}`)
            .text(`Shift Start Time: ${report.shift_start_time}`, { align: 'right' })
            .moveDown(0.5);
        doc.text(`Temperature/Humidity: ${report.temperature_humidity}`)
            .moveDown(1);

        // Materials Section
        doc.text(`Sheeting / Materials: ${report.material_description}`)
            .moveDown(1);

        // Employees Section
        doc.text('Employees:', { underline: true })
            .text(`Hours Worked: ${report.hours_worked}`)
            .text(`Employee: ${report.employee}`)
            .text(`Straight Time: ${report.straight_time}`)
            .text(`Time and a Half: ${report.time_and_a_half}`)
            .text(`Double Time: ${report.double_time}`)
            .moveDown(1);

        // Equipment Section
        doc.text('Equipment:', { underline: true })
            .text(`Trucks: ${report.trucks}`)
            .text(`Welders: ${report.welders}`)
            .text(`Generators: ${report.generators}`)
            .text(`Compressors: ${report.compressors}`)
            .text(`Company Fuel: ${report.fuel}`)
            .text(`Scaffolding: ${report.scaffolding}`)
            .text(`Safety Equipment: ${report.safety_equipment}`)
            .text(`Miscellaneous Equipment: ${report.miscellaneous_equipment}`)
            .moveDown(1);

        // Manlifts / Rentals Section
        doc.text('Manlifts / Rentals:', { underline: true })
            .text(`Manlifts Equipment: ${report.manlifts_equipment}`)
            .text(`Fuel: ${report.manlifts_fuel}`)
            .moveDown(1);

        // Sub-Contract Section
        doc.text('Sub-Contract:', { underline: true })
            .text(report.sub_contract)
            .moveDown(1);

        // Emergency Purchases Section
        doc.text('Emergency Purchases:', { underline: true })
            .text(report.emergency_purchases)
            .moveDown(1);

        // Delay / Lost Time Section
        doc.text('Delay / Lost Time:', { underline: true })
            .text(report.delay_lost_time)
            .moveDown(1);

        // Employees Off Section
        doc.text('Employees Off:', { underline: true })
            .text(report.employees_off)
            .moveDown(1);

        // Approved By Section
        doc.text(`Approved By: ${report.approved_by}`)
            .text(`Report Copy: ${report.report_copy}`)
            .moveDown(2);

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

