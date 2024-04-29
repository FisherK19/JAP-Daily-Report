const express = require('express');
const router = express.Router();
const pool = require('../config/connection'); 

// Route for fetching all admin reports
router.get('/', (req, res) => {
    pool.query('SELECT * FROM admin_reports', (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
        res.status(200).json(results);
    });
});

// Route for fetching a specific admin report by ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    pool.query('SELECT * FROM admin_reports WHERE id = ?', [id], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Report not found' });
        }
        res.status(200).json(results[0]);
    });
});

// Route for creating a new admin report
router.post('/', (req, res) => {
    const { title, description } = req.body;
    pool.query('INSERT INTO admin_reports (title, description) VALUES (?, ?)', [title, description], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
        res.status(201).json({ message: 'Report created successfully' });
    });
});

// Route for updating an existing admin report
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;
    pool.query('UPDATE admin_reports SET title = ?, description = ? WHERE id = ?', [title, description, id], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
        res.status(200).json({ message: 'Report updated successfully' });
    });
});

// Route for deleting an existing admin report
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    pool.query('DELETE FROM admin_reports WHERE id = ?', [id], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
        res.status(200).json({ message: 'Report deleted successfully' });
    });
});

module.exports = router;


