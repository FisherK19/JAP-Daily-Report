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
    doc.image(path.join(__dirname, '../assets/images/company-logo.png'), { width: 100, align: 'center' })
        .fontSize(20)
        .text('JOHN A. PAPALAS & COMPANY', { align: 'center' })
        .fontSize(12)
        .text('Tel - 313-388-3000    Fax - 313-388-9864', { align: 'center' })
        .moveDown();

    doc.fontSize(16).text('Daily Report', { align: 'center' }).moveDown();

    reports.forEach(report => {
        doc.fontSize(10);

        // Table for main information
        doc.text(`Date: ${new Date(report.date).toDateString()}`, { continued: true })
           .text(`Job Number: ${report.job_number}`, { align: 'right' });

        doc.text(`T&M: ${report.t_and_m ? 'Yes' : 'No'}`, { continued: true })
           .text(`Contract: ${report.contract ? 'Yes' : 'No'}`, { align: 'right' });

        doc.text(`Foreman: ${report.foreman}`, { continued: true })
           .text(`Cell Number: ${report.cell_number}`, { align: 'right' });

        doc.text(`Customer: ${report.customer}`, { continued: true })
           .text(`Customer PO: ${report.customer_po}`, { align: 'right' });

        doc.text(`Job Site: ${report.job_site}`, { continued: true })
           .text(`Job Completion: ${report.job_completion}`, { align: 'right' });

        doc.text(`Job Description: ${report.job_description}`, { continued: true })
           .text(`Shift Start Time: ${report.shift_start_time}`, { align: 'right' });

        doc.text(`Temperature/Humidity: ${report.temperature_humidity}`, { continued: true })
           .text(`Equipment Description: ${report.equipment_description}`, { align: 'right' });

        doc.text(`Sheeting / Materials: ${report.material_description}`, { continued: true })
           .text(`Report Copy: ${report.report_copy}`, { align: 'right' });

        doc.moveDown();

        // Equipment table
        doc.fontSize(12).text('Equipment:', { underline: true }).moveDown(0.5);
        doc.table([
            ['Equipment', 'Count'],
            ['Trucks', report.trucks],
            ['Welders', report.welders],
            ['Generators', report.generators],
            ['Compressors', report.compressors],
            ['Company Fuel', report.fuel],
            ['Scaffolding', report.scaffolding],
            ['Safety Equipment', report.safety_equipment],
            ['Miscellaneous Equipment', report.miscellaneous_equipment]
        ], { width: 400, columnsSize: [300, 100] });

        doc.moveDown();

        // Employees table
        doc.fontSize(12).text('Employees:', { underline: true }).moveDown(0.5);
        const employeeData = [
            {
                name: report.employee,
                hours_worked: report.hours_worked,
                straight_time: report.straight_time,
                time_and_a_half: report.time_and_a_half,
                double_time: report.double_time
            }
        ];
        employeeData.forEach(item => {
            doc.table([
                ['Employee', 'Hours Worked', 'Straight Time', 'Time and a Half', 'Double Time'],
                [item.name, item.hours_worked, item.straight_time, item.time_and_a_half, item.double_time]
            ], { width: 400, columnsSize: [100, 75, 75, 75, 75] });
        });

        doc.moveDown(2);
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
    });
}

// Route to generate and download PDF report for a specific user
router.get('/pdf/:username', (req, res) => {
    const username = req.params.username;

    pool.query('SELECT * FROM daily_reports WHERE username = ?', [username], (error, results) => {
        if (error) {
            console.error('Error fetching reports:', error);
            return res.status(500).send('Error fetching reports');
        }

        if (results.length === 0) {
            return res.status(404).send('No reports found for this user');
        }

        generatePDF(results, username, res);
    });
});

// Route to generate and download Excel report for a specific user
router.get('/excel/:username', (req, res) => {
    const username = req.params.username;

    pool.query('SELECT * FROM daily_reports WHERE username = ?', [username], (error, results) => {
        if (error) {
            console.error('Error fetching reports:', error);
            return res.status(500).send('Error fetching reports');
        }

        if (results.length === 0) {
            return res.status(404).send('No reports found for this user');
        }

        generateExcel(results, username, res);
    });
});

// Route to fetch all users
router.get('/users', (req, res) => {
    pool.query('SELECT username FROM users', (error, results) => {
        if (error) {
            console.error('Error fetching users:', error);
            return res.status(500).send('Error fetching users');
        }

        res.json(results);
    });
});

module.exports = router;
