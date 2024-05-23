const express = require('express');
const router = express.Router();
const { pool } = require('../config/connection');
const PDFDocument = require('pdfkit');
const nodemailer = require('nodemailer');

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

// Function to send email alert with download link to PDF report
function sendAlertEmail(adminEmail, username, pdfPath) {
    const mailOptions = {
        from: process.env.EMAIL_ADDRESS,
        to: adminEmail,
        subject: 'New PDF Daily Report Downloaded',
        html: `A new PDF daily report has been downloaded for user ${username}.<br>Download Link: <a href="${pdfPath}">${pdfPath}</a>`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
}

// Route to generate and download PDF report for a specific user
router.get('/pdf/:username', async (req, res) => {
    const { username } = req.params;

    try {
        // Fetch user's daily reports from the database
        const [reports] = await pool.query('SELECT * FROM daily_reports WHERE employee = ?', [username]);

        // Create a new PDF document
        const doc = new PDFDocument();
        const pdfPath = `user_${username}_reports.pdf`;

        // Write daily reports data to the PDF document
        reports.forEach(report => {
            doc.text(`Date: ${report.date}`);
            doc.text(`Title: ${report.title}`);
            doc.text(`Content: ${report.content}`);
            doc.moveDown(); // Move to the next line
        });

        // Set content disposition header for attachment
        res.setHeader('Content-Disposition', `attachment; filename="${pdfPath}"`);

        // Pipe the PDF document directly to the response
        doc.pipe(res);
        doc.end();

        // Send email alert with download link to admin
        const adminEmail = process.env.EMAIL_ADDRESS; // Use a variable for the admin email
        sendAlertEmail(adminEmail, username, pdfPath);
    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;

