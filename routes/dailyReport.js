// Import necessary modules
const express = require('express');
const router = express.Router();
const DailyReport = require('../models/daily-report');

// Define routes for daily report management

// Route to retrieve all daily reports
router.get('/', async (req, res) => {
    try {
        const dailyReports = await DailyReport.find();
        res.json(dailyReports);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Route to submit a new daily report
router.post('/', async (req, res) => {
    try {
        const newDailyReport = await DailyReport.create(req.body);
        res.status(201).json(newDailyReport);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Route to update an existing daily report
router.put('/:id', async (req, res) => {
    try {
        const updatedDailyReport = await DailyReport.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedDailyReport) {
            return res.status(404).json({ message: 'Daily report not found' });
        }
        res.json(updatedDailyReport);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Route to delete a daily report
router.delete('/:id', async (req, res) => {
    try {
        const deletedDailyReport = await DailyReport.findByIdAndDelete(req.params.id);
        if (!deletedDailyReport) {
            return res.status(404).json({ message: 'Daily report not found' });
        }
        res.json({ message: 'Daily report deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Export the router
module.exports = router;
