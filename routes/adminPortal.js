const express = require('express');
const router = express.Router();
const { pool } = require('../config/connection');

router.get('/reports', async (req, res) => {
    try {
        const date = req.query.date;

        if (!date) {
            return res.status(400).json({ message: 'Date is required' });
        }

        const [reports] = await pool.query('SELECT * FROM daily_reports WHERE date = ?', [date]);

        if (reports.length === 0) {
            return res.status(404).json({ message: 'No reports found for the specified date' });
        }

        res.json(reports);
    } catch (error) {
        console.error('Error fetching reports:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

module.exports = router;








