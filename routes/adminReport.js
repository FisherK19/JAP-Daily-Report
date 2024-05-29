const express = require('express');
const router = express.Router();
const { pool } = require('../config/connection');
const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');
const path = require('path');
require('pdfkit-table');

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

    reports.forEach((report, index) => {
        console.log(`Processing report ${index + 1} of ${reports.length}`);
        doc.fontSize(10);

        // Main information table
        const mainInfoTable = [
            ['Date', new Date(report.date).toDateString()],
            ['Job Number', report.job_number],
            ['T&M', report.t_and_m ? 'Yes' : 'No'],
            ['Contract', report.contract ? 'Yes' : 'No'],
            ['Foreman', report.foreman],
            ['Cell Number', report.cell_number],
            ['Customer', report.customer],
            ['Customer PO', report.customer_po],
            ['Job Site', report.job_site],
            ['Job Description', report.job_description],
            ['Job Completion', report.job_completion],
            ['Shift Start Time', report.shift_start_time],
            ['Temperature/Humidity', report.temperature_humidity],
            ['Equipment Description', report.equipment_description],
            ['Sheeting / Materials', report.material_description],
            ['Report Copy', report.report_copy]
        ];

        doc.table({ headers: ['Key', 'Value'], rows: mainInfoTable }, { width: 500 }).moveDown();

        // Equipment table
        const equipmentTable = [
            ['Trucks', report.trucks],
            ['Welders', report.welders],
            ['Generators', report.generators],
            ['Compressors', report.compressors],
            ['Company Fuel', report.fuel],
            ['Scaffolding', report.scaffolding],
            ['Safety Equipment', report.safety_equipment],
            ['Miscellaneous Equipment', report.miscellaneous_equipment]
        ];

        doc.fontSize(12).text('Equipment:', { underline: true }).moveDown(0.5);
        doc.table({ headers: ['Equipment', 'Count'], rows: equipmentTable }, { width: 400 }).moveDown();

        // Employees table
        const employeesTable = [
            ['Employee', 'Hours Worked', 'Straight Time', 'Time and a Half', 'Double Time'],
            [report.employee, report.hours_worked, report.straight_time, report.time_and_a_half, report.double_time],
            [report.employee_2_name, report.employee_2_hours_worked, report.employee_2_straight_time, report.employee_2_time_and_a_half, report.employee_2_double_time],
            [report.employee_3_name, report.employee_3_hours_worked, report.employee_3_straight_time, report.employee_3_time_and_a_half, report.employee_3_double_time],
            [report.employee_4_name, report.employee_4_hours_worked, report.employee_4_straight_time, report.employee_4_time_and_a_half, report.employee_4_double_time],
            [report.employee_5_name, report.employee_5_hours_worked, report.employee_5_straight_time, report.employee_5_time_and_a_half, report.employee_5_double_time],
            [report.employee_6_name, report.employee_6_hours_worked, report.employee_6_straight_time, report.employee_6_time_and_a_half, report.employee_6_double_time],
            [report.employee_7_name, report.employee_7_hours_worked, report.employee_7_straight_time, report.employee_7_time_and_a_half, report.employee_7_double_time],
            [report.employee_8_name, report.employee_8_hours_worked, report.employee_8_straight_time, report.employee_8_time_and_a_half, report.employee_8_double_time],
            [report.employee_9_name, report.employee_9_hours_worked, report.employee_9_straight_time, report.employee_9_time_and_a_half, report.employee_9_double_time],
            [report.employee_10_name, report.employee_10_hours_worked, report.employee_10_straight_time, report.employee_10_time_and_a_half, report.employee_10_double_time],
            [report.employee_11_name, report.employee_11_hours_worked, report.employee_11_straight_time, report.employee_11_time_and_a_half, report.employee_11_double_time],
            [report.employee_12_name, report.employee_12_hours_worked, report.employee_12_straight_time, report.employee_12_time_and_a_half, report.employee_12_double_time],
            [report.employee_13_name, report.employee_13_hours_worked, report.employee_13_straight_time, report.employee_13_time_and_a_half, report.employee_13_double_time],
            [report.employee_14_name, report.employee_14_hours_worked, report.employee_14_straight_time, report.employee_14_time_and_a_half, report.employee_14_double_time],
            [report.employee_15_name, report.employee_15_hours_worked, report.employee_15_straight_time, report.employee_15_time_and_a_half, report.employee_15_double_time],
            [report.employee_16_name, report.employee_16_hours_worked, report.employee_16_straight_time, report.employee_16_time_and_a_half, report.employee_16_double_time],
            [report.employee_17_name, report.employee_17_hours_worked, report.employee_17_straight_time, report.employee_17_time_and_a_half, report.employee_17_double_time],
            [report.employee_18_name, report.employee_18_hours_worked, report.employee_18_straight_time, report.employee_18_time_and_a_half, report.employee_18_double_time],
            [report.employee_19_name, report.employee_19_hours_worked, report.employee_19_straight_time, report.employee_19_time_and_a_half, report.employee_19_double_time],
            [report.employee_20_name, report.employee_20_hours_worked, report.employee_20_straight_time, report.employee_20_time_and_a_half, report.employee_20_double_time]
        ];

        doc.fontSize(12).text('Employees:', { underline: true }).moveDown(0.5);
        doc.table({ headers: ['Employee', 'Hours Worked', 'Straight Time', 'Time and a Half', 'Double Time'], rows: employeesTable }, { width: 500 }).moveDown(2);

        // Other details
        const otherDetailsTable = [
            ['Sub-Contract', report.sub_contract],
            ['Emergency Purchases', report.emergency_purchases],
            ['Delay / Lost Time', report.delay_lost_time],
            ['Employees Off', report.employees_off],
            ['Approved By', report.approved_by]
        ];

        doc.table({ headers: ['Key', 'Value'], rows: otherDetailsTable }, { width: 500 }).moveDown(2);
    });

    doc.end();
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
