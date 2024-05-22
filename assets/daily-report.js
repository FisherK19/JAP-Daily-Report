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
