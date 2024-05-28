const express = require('express');
const router = express.Router();
const { pool } = require('../config/connection');
const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');
const path = require('path');
require('pdfkit-table');

function generatePDF(reports, username, res) {
    const doc = new PDFDocument({ margin: 30, size: 'A4' });
    const pdfPath = `user_${username}_reports.pdf`;
    res.setHeader('Content-Disposition', `attachment; filename="${pdfPath}"`);
    doc.pipe(res);

    // Header
    doc.image(path.join(__dirname, '..', 'assets', 'images', 'company-logo.png'), {
        width: 100,
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
        // Create table data
        const tableData = {
            headers: [
                { label: 'Date:', value: new Date(report.date).toDateString() },
                { label: 'Job Number:', value: report.job_number },
                { label: 'T&M:', value: report.t_and_m ? 'Yes' : 'No' },
                { label: 'Contract:', value: report.contract ? 'Yes' : 'No' },
                { label: 'Foreman:', value: report.foreman },
                { label: 'Cell Number:', value: report.cell_number },
                { label: 'Customer:', value: report.customer },
                { label: 'Customer PO:', value: report.customer_po },
                { label: 'Job Site:', value: report.job_site },
                { label: 'Job Description:', value: report.job_description },
                { label: 'Job Completion:', value: report.job_completion },
                { label: 'Shift Start Time:', value: report.shift_start_time },
                { label: 'Temperature/Humidity:', value: report.temperature_humidity },
                { label: 'Sheeting / Materials:', value: report.materials },
                { label: 'Equipment Description:', value: report.equipment_description },
                { label: 'Report Copy:', value: report.report_copy }
            ],
            rows: []
        };

        const employeesData = (report.employees || []).map(employee => [
            employee.hours_worked,
            employee.employee,
            employee.straight_time,
            employee.time_and_a_half,
            employee.double_time
        ]);

        const equipmentData = [
            { label: 'Trucks:', value: report.trucks },
            { label: 'Welders:', value: report.welders },
            { label: 'Generators:', value: report.generators },
            { label: 'Compressors:', value: report.compressors },
            { label: 'Company Fuel:', value: report.fuel },
            { label: 'Scaffolding:', value: report.scaffolding },
            { label: 'Safety Equipment:', value: report.safety_equipment },
            { label: 'Miscellaneous Equipment:', value: report.miscellaneous_equipment }
        ];

        const manliftsData = [
            { label: 'Manlifts Equipment:', value: report.manlifts_equipment },
            { label: 'Fuel:', value: report.manlifts_fuel }
        ];

        const otherData = [
            { label: 'Sub-Contract:', value: report.sub_contract },
            { label: 'Emergency Purchases:', value: report.emergency_purchases },
            { label: 'Delay / Lost Time:', value: report.delay_lost_time },
            { label: 'Employees Off:', value: report.employees_off },
            { label: 'Approved By:', value: report.approved_by }
        ];

        // Add table to the document
        doc.table(tableData, {
            prepareHeader: () => doc.font('Helvetica-Bold'),
            prepareRow: (row, i) => doc.font('Helvetica').fontSize(10)
        });

        if (employeesData.length > 0) {
            const employeesTable = {
                headers: ['Hours Worked', 'Employee', 'Straight Time', 'Time & 1/2', 'Double Time'],
                rows: employeesData
            };
            doc.moveDown(1).text('Employees:', { underline: true }).moveDown(0.5);
            doc.table(employeesTable, {
                prepareHeader: () => doc.font('Helvetica-Bold'),
                prepareRow: (row, i) => doc.font('Helvetica').fontSize(10)
            });
        }

        doc.moveDown(1).text('Equipment:', { underline: true }).moveDown(0.5);
        equipmentData.forEach(item => {
            doc.text(`${item.label} ${item.value}`, { indent: 20 });
        });

        doc.moveDown(1).text('Manlifts / Rentals:', { underline: true }).moveDown(0.5);
        manliftsData.forEach(item => {
            doc.text(`${item.label} ${item.value}`, { indent: 20 });
        });

        doc.moveDown(1);
        otherData.forEach(item => {
            doc.text(item.label, { underline: true }).text(item.value || 'N/A', { indent: 20 }).moveDown(0.5);
        });

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

