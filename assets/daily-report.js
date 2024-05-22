document.addEventListener('DOMContentLoaded', function() {
    // Update dropdown color based on selection
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

    // Function to dynamically add employee sections
    const addEmployeeBtn = document.getElementById('add-employee-btn');
    const employeesSection = document.querySelector('.employees-section');

    if (addEmployeeBtn && employeesSection) {
        addEmployeeBtn.addEventListener('click', function() {
            const employeeEntry = document.createElement('div');
            employeeEntry.classList.add('employee-entry');

            employeeEntry.innerHTML = `
                <div><label>Hours Worked</label><input type="text" name="hours_worked[]"></div>
                <div><label>EMPLOYEE</label><input type="text" name="employee[]"></div>
                <div><label>Straight</label><input type="text" name="straight_time[]"></div>
                <div><label>Time & 1/2</label><input type="text" name="time_and_a_half[]"></div>
                <div><label>Double Time</label><input type="text" name="double_time[]"></div>
                <button type="button" class="delete-employee-btn"><i class="fas fa-trash-alt"></i></button>
            `;

            employeesSection.appendChild(employeeEntry);

            // Add event listener for the new delete button
            employeeEntry.querySelector('.delete-employee-btn').addEventListener('click', function() {
                employeeEntry.remove();
            });
        });
    }

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
            }).then(response => response.json()).then(data => {
                alert(data.message);
            }).catch(error => {
                console.error('Error:', error);
            });
        });
    }
});

// Logout function
function logout() {
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
}
