import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
    const [timesheets, setTimesheets] = useState([]);

    useEffect(() => {
        // Fetch timesheet entries
        axios.get('/api/timesheets')
            .then(response => setTimesheets(response.data))
            .catch(error => console.error('Error fetching timesheets', error));
    }, []);

    const handleApproval = (timesheetId, status) => {
        // Send approval/rejection
        axios.post(`/api/timesheets/${timesheetId}/status`, { status })
            .then(response => {
                // Update the UI accordingly...
            })
            .catch(error => console.error('Error updating status', error));
    };

    return (
        <div>
            <h1>Admin Dashboard</h1>
            <table>
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Date</th>
                        <th>Hours</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {timesheets.map(timesheet => (
                        <tr key={timesheet.id}>
                            <td>{timesheet.user}</td>
                            <td>{timesheet.date}</td>
                            <td>{timesheet.hours}</td>
                            <td>{timesheet.status}</td>
                            <td>
                                <button onClick={() => handleApproval(timesheet.id, 'approved')}>Approve</button>
                                <button onClick={() => handleApproval(timesheet.id, 'rejected')}>Reject</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {/* Add more components for filtering, reports, etc. */}
        </div>
    );
};

export default AdminDashboard;
