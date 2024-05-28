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
    doc.image(path.join(__dirname, '..', 'assets', 'images', 'company-logo.png'), {
        width: 80,
        align: 'center'
    }).moveDown(0.5);

    doc.fontSize(18)
        .text('JOHN A. PAPALAS & COMPANY', { align: 'center' })
        .moveDown(0.5)
        .fontSize(12)
        .text('Tel - 313-388-3000    Fax - 313-388-9864', { align: 'center' })
        .moveDown(1);

    doc.fontSize(16).text('Daily Report', { align: 'center' }).moveDown(1);

    // Iterate through each report
    reports.forEach(report => {
        // First column
        const leftColumn = [
            `Date: ${new Date(report.date).toDateString()}`,
            `T&M: ${report.t_and_m ? 'Yes' : 'No'}`,
            `Foreman: ${report.foreman}`,
            `Customer: ${report.customer}`,
            `Job Site: ${report.job_site}`,
            `Job Description: ${report.job_description}`,
            `Temperature/Humidity: ${report.temperature_humidity}`,
            `Sheeting / Materials: ${report.materials}`,
        ].join('\n');

        doc.fontSize(10).text(leftColumn, { width: 250 });

        // Second column
        const rightColumn = [
            `Job Number: ${report.job_number}`,
            `Contract: ${report.contract ? 'Yes' : 'No'}`,
            `Cell Number: ${report.cell_number}`,
            `Customer PO: ${report.customer_po}`,
            `Job Completion: ${report.job_completion}`,
            `Shift Start Time: ${report.shift_start_time}`,
            `Equipment Description: ${report.equipment_description}`,
            `Report Copy: ${report.report_copy}`,
        ].join('\n');

        doc.text(rightColumn, 300, doc.y - doc.currentLineHeight(), { width: 250 });

        doc.moveDown(1);

        // Employees section
        if (report.employees && report.employees.length > 0) {
            doc.fontSize(10).text('Employees:', { underline: true });
            report.employees.forEach(employee => {
                doc.text(
                    `Hours Worked: ${employee.hours_worked}\nEmployee: ${employee.employee}\nStraight Time: ${employee.straight_time}\nTime and a Half: ${employee.time_and_a_half}\nDouble Time: ${employee.double_time}`
                );
                doc.moveDown(0.5);
            });
        }

        // Equipment section
        const equipmentSection = [
            'Equipment:',
            `Trucks: ${report.trucks}`,
            `Welders: ${report.welders}`,
            `Generators: ${report.generators}`,
            `Compressors: ${report.compressors}`,
            `Company Fuel: ${report.fuel}`,
            `Scaffolding: ${report.scaffolding}`,
            `Safety Equipment: ${report.safety_equipment}`,
            `Miscellaneous Equipment: ${report.miscellaneous_equipment}`,
        ].join('\n');

        doc.text(equipmentSection, { width: 250 });
        doc.moveDown(0.5);

        // Manlifts / Rentals section
        const manliftsSection = [
            'Manlifts / Rentals:',
            `Manlifts Equipment: ${report.manlifts_equipment}`,
            `Fuel: ${report.manlifts_fuel}`,
        ].join('\n');

        doc.text(manliftsSection, { width: 250 });
        doc.moveDown(0.5);

        // Sub-Contract section
        doc.text('Sub-Contract:', { underline: true });
        doc.text(report.sub_contract || 'N/A');
        doc.moveDown(0.5);

        // Emergency Purchases section
        doc.text('Emergency Purchases:', { underline: true });
        doc.text(report.emergency_purchases || 'N/A');
        doc.moveDown(0.5);

        // Delay / Lost Time section
        doc.text('Delay / Lost Time:', { underline: true });
        doc.text(report.delay_lost_time || 'N/A');
        doc.moveDown(0.5);

        // Employees Off section
        doc.text('Employees Off:', { underline: true });
        doc.text(report.employees_off || 'N/A');
        doc.moveDown(0.5);

        // Approved By section
        doc.text('Approved By:', { underline: true });
        doc.text(report.approved_by || 'N/A');
        doc.moveDown(0.5);

        doc.addPage(); // Add a new page for the next report if necessary
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

