document.addEventListener('DOMContentLoaded', function() {
    const reportCopyDropdown = document.getElementById('report_copy');

    if (reportCopyDropdown) {
        function updateDropdownColor() {
            const selectedValue = reportCopyDropdown.value;
            reportCopyDropdown.className = ''; // Reset classes
            reportCopyDropdown.classList.add(selectedValue); // Add class based on value
        }

        reportCopyDropdown.addEventListener('change', updateDropdownColor);

        // Initialize color on page load
        updateDropdownColor();
    }

    // Add employee entry
    const addEmployeeBtn = document.getElementById('add-employee-btn');
    const employeesSection = document.querySelector('.employees-section');

    if (addEmployeeBtn && employeesSection) {
        addEmployeeBtn.addEventListener('click', function() {
            const newEmployeeEntry = document.createElement('div');
            newEmployeeEntry.classList.add('employee-entry');
            newEmployeeEntry.innerHTML = `
                <div><label>Hours Worked</label><input type="text" name="hours_worked[]"></div>
                <div><label>EMPLOYEE</label><input type="text" name="employee[]"></div>
                <div><label>Straight</label><input type="text" name="straight_time[]"></div>
                <div><label>Time & 1/2</label><input type="text" name="time_and_a_half[]"></div>
                <div><label>Double Time</label><input type="text" name="double_time[]"></div>
                <button type="button" class="delete-employee-btn"><i class="fas fa-trash-alt"></i></button>
            `;
            employeesSection.appendChild(newEmployeeEntry);

            // Add event listener for the new delete button
            const deleteBtn = newEmployeeEntry.querySelector('.delete-employee-btn');
            deleteBtn.addEventListener('click', function() {
                newEmployeeEntry.remove();
            });
        });
    }

    // Delete employee entry
    document.addEventListener('click', function(event) {
        if (event.target && event.target.classList.contains('delete-employee-btn')) {
            event.target.closest('.employee-entry').remove();
        }
    });

    // Form submission logic
    const dailyReportForm = document.getElementById('daily-report-form');
    if (dailyReportForm) {
        dailyReportForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const formData = new FormData(this);
            const data = Object.fromEntries(formData.entries());

            // Convert arrays to individual fields
            data.hours_worked = formData.getAll('hours_worked[]');
            data.employee = formData.getAll('employee[]');
            data.straight_time = formData.getAll('straight_time[]');
            data.time_and_a_half = formData.getAll('time_and_a_half[]');
            data.double_time = formData.getAll('double_time[]');

            console.log('Form data:', data); // Log form data
            fetch('/daily-report', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: { 'Content-Type': 'application/json' }
            }).then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            }).then(data => {
                alert(data.message);
            }).catch(error => {
                console.error('Error:', error);
                alert('An error occurred while submitting the report. Please try again.');
            });
        });
    }

    // Logout function
    const logoutLink = document.getElementById('logout-link');
    if (logoutLink) {
        logoutLink.addEventListener('click', function(event) {
            event.preventDefault();
            fetch('/logout', {
                method: 'POST',
                credentials: 'same-origin'
            }).then(response => {
                if (response.ok) {
                    window.location.href = '/login';
                } else {
                    alert('Logout failed');
                }
            }).catch(error => {
                console.error('Logout error:', error);
            });
        });
    }
});

