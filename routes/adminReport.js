const express = require('express');
const router = express.Router();
const { pool } = require('../config/connection');
const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');

// Function to generate PDF report
function generatePDF(reports, username, res) {
    const doc = new PDFDocument({ margin: 30, size: 'A4' });
    const pdfPath = `user_${username}_reports.pdf`;
    res.setHeader('Content-Disposition', `attachment; filename="${pdfPath}"`);
    doc.pipe(res);

    // Header
    doc.image('assets/images/company-logo.png', 50, 45, { width: 50 })
        .fillColor('#444444')
        .fontSize(20)
        .text('JOHN A. PAPALAS & COMPANY', 110, 57)
        .fontSize(10)
        .text('Tel - 313-388-3000    Fax - 313-388-9864', 200, 65, { align: 'right' })
        .moveDown();

    doc.fontSize(16).text('Daily Report', { align: 'center' }).moveDown();

    reports.forEach(report => {
        // Table with two columns for each section
        doc.fontSize(10);
        const table = {
            headers: [
                { label: 'Date', property: 'date' },
                { label: 'Job Number', property: 'job_number' },
                { label: 'T&M', property: 't_and_m', align: 'center' },
                { label: 'Contract', property: 'contract', align: 'center' },
                { label: 'Foreman', property: 'foreman' },
                { label: 'Cell Number', property: 'cell_number' },
                { label: 'Customer', property: 'customer' },
                { label: 'Customer PO', property: 'customer_po' },
                { label: 'Job Site', property: 'job_site' },
                { label: 'Job Description', property: 'job_description' },
                { label: 'Job Completion', property: 'job_completion' },
                { label: 'Trucks', property: 'trucks' },
                { label: 'Welders', property: 'welders' },
                { label: 'Generators', property: 'generators' },
                { label: 'Compressors', property: 'compressors' },
                { label: 'Fuel', property: 'fuel' },
                { label: 'Scaffolding', property: 'scaffolding' },
                { label: 'Safety Equipment', property: 'safety_equipment' },
                { label: 'Miscellaneous Equipment', property: 'miscellaneous_equipment' },
                { label: 'Material Description', property: 'material_description' },
                { label: 'Equipment Description', property: 'equipment_description' },
                { label: 'Hours Worked', property: 'hours_worked' },
                { label: 'Employee', property: 'employee' },
                { label: 'Straight Time', property: 'straight_time' },
                { label: 'Time and a Half', property: 'time_and_a_half' },
                { label: 'Double Time', property: 'double_time' },
                { label: 'Emergency Purchases', property: 'emergency_purchases' },
                { label: 'Approved By', property: 'approved_by' },
                { label: 'Shift Start Time', property: 'shift_start_time' },
                { label: 'Temperature/Humidity', property: 'temperature_humidity' },
                { label: 'Report Copy', property: 'report_copy' },
            ],
            rows: [
                [
                    new Date(report.date).toDateString(),
                    report.job_number,
                    report.t_and_m ? 'Yes' : 'No',
                    report.contract ? 'Yes' : 'No',
                    report.foreman,
                    report.cell_number,
                    report.customer,
                    report.customer_po,
                    report.job_site,
                    report.job_description,
                    report.job_completion,
                    report.trucks,
                    report.welders,
                    report.generators,
                    report.compressors,
                    report.fuel,
                    report.scaffolding,
                    report.safety_equipment,
                    report.miscellaneous_equipment,
                    report.material_description,
                    report.equipment_description,
                    report.hours_worked,
                    report.employee,
                    report.straight_time,
                    report.time_and_a_half,
                    report.double_time,
                    report.emergency_purchases,
                    report.approved_by,
                    report.shift_start_time,
                    report.temperature_humidity,
                    report.report_copy
                ]
            ]
        };
        doc.table(table, { width: 500 });

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

