// Import necessary modules
const express = require('express');
const router = express.Router();
const DailyReport = require('../models/daily-report');

// Route for fetching all daily reports
router.get('/', async (req, res) => {
    try {
        // Fetch all daily reports from the database
        const reports = await DailyReport.find();

        // Respond with the fetched reports
        res.status(200).json({ reports });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Route for fetching a specific daily report by ID
router.get('/:id', async (req, res) => {
    try {
        // Fetch the daily report by ID from the database
        const report = await DailyReport.findById(req.params.id);

        // Check if the report exists
        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }

        // Respond with the fetched report
        res.status(200).json({ report });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// Export the router
module.exports = router;
