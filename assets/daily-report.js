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
