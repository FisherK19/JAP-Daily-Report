// Import necessary modules
const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Define routes for administrative user tasks

// Route for retrieving all users
router.get('/', async (req, res) => {
    try {
        // Fetch all users from the database
        const users = await User.find();

        // Respond with the fetched users
        res.status(200).json({ users });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Route for retrieving a specific user by ID
router.get('/:id', async (req, res) => {
    try {
        // Fetch the user by ID from the database
        const user = await User.findById(req.params.id);

        // Check if the user exists
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Respond with the fetched user
        res.status(200).json({ user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Route for updating a user's information
router.put('/:id', async (req, res) => {
    try {
        // Fetch the user by ID from the database and update its information
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });

        // Respond with the updated user
        res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Route for deleting a user
router.delete('/:id', async (req, res) => {
    try {
        // Delete the user by ID from the database
        await User.findByIdAndDelete(req.params.id);

        // Respond with success message
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Export the router
module.exports = router;

