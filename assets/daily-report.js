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
                // Show success message
                const successMessage = document.createElement('div');
                successMessage.textContent = 'Daily report submitted successfully';
                successMessage.classList.add('success-message');
                dailyReportForm.appendChild(successMessage);
                // Remove success message after 5 seconds
                setTimeout(() => {
                    successMessage.remove();
                }, 5000);
            }).catch(error => {
                console.error('Error:', error);
                alert('Failed to submit the daily report');
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
            });
        });
    }
});
