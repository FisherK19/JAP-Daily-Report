const express = require('express');
const router = express.Router();
const pool = require('../config/connection');

// Define routes for daily report management

// Route to retrieve all daily reports
router.get('/', (req, res) => {
    pool.query('SELECT * FROM daily_reports', (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
        res.json(results);
    });
});

// Route to submit a new daily report
router.post('/', (req, res) => {
    const { title, content, date } = req.body;
    pool.query('INSERT INTO daily_reports (title, content, date) VALUES (?, ?, ?)', [title, content, date], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
        res.status(201).json({ message: 'Daily report submitted successfully' });
    });
});

// Route to update an existing daily report
router.put('/:id', (req, res) => {
    const { title, content, date } = req.body;
    const { id } = req.params;
    pool.query('UPDATE daily_reports SET title = ?, content = ?, date = ? WHERE id = ?', [title, content, date, id], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Daily report not found' });
        }
        res.json({ message: 'Daily report updated successfully' });
    });
});

// Route to delete a daily report
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    pool.query('DELETE FROM daily_reports WHERE id = ?', [id], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Daily report not found' });
        }
        res.json({ message: 'Daily report deleted successfully' });
    });
});

// Export the router
module.exports = router;

