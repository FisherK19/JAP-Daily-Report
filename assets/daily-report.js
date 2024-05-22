document.addEventListener('DOMContentLoaded', function() {
    const reportCopyDropdown = document.getElementById('report_copy');
    
    function updateDropdownColor() {
        const selectedValue = reportCopyDropdown.value;
        reportCopyDropdown.className = ''; // Reset classes
        reportCopyDropdown.classList.add(selectedValue); // Add class based on value
    }

    reportCopyDropdown.addEventListener('change', updateDropdownColor);

    // Initialize color on page load
    updateDropdownColor();
});
