const express = require('express');
const router = express.Router();
const { pool } = require('../config/connection');
const pdfkit = require('pdfkit');
const fs = require('fs');
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
function sendAlertEmail(adminEmail, userId, pdfPath) {
    const mailOptions = {
        from: 'fisherkristie19@icloud.com',
        to: adminEmail,
        subject: 'New PDF Daily Report Downloaded',
        html: `A new PDF daily report has been downloaded for user ${userId}.<br>Download Link: <a href="${pdfPath}">${pdfPath}</a>`
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
router.get('/pdf/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        // Fetch user's daily reports from the database
        const reports = await pool.query('SELECT * FROM daily_reports WHERE user_id = ?', [userId]);

        // Create a new PDF document
        const doc = new pdfkit();
        const pdfPath = `user_${userId}_reports.pdf`;

        // Write daily reports data to the PDF document
        reports.forEach(report => {
            doc.text(`Date: ${report.date}`);
            doc.text(`Title: ${report.title}`);
            doc.text(`Content: ${report.content}`);
            doc.moveDown(); // Move to the next line
        });

        // Save the PDF file
        doc.pipe(fs.createWriteStream(pdfPath));
        doc.end();

        // Send email alert with download link to admin
        const adminEmail = 'fisherkristie19@icloud.com'; // Replace with actual admin email
        sendAlertEmail(adminEmail, userId, pdfPath);

        // Send the PDF file as a response
        res.download(pdfPath);
    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;


