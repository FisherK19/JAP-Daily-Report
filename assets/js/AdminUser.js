// Function to render daily reports
function renderDailyReports(data) {
    // Clear previous data
    document.getElementById('reports-container').innerHTML = '';

    // Render daily reports here
    data.reports.forEach(report => {
        const reportId = report.id;
        const reportTitle = report.title;

        // Create a container for each report
        const reportContainer = document.createElement('div');

        // Create PDF download button
        const pdfButton = document.createElement('button');
        pdfButton.textContent = `Download PDF Report for ${reportTitle}`;
        pdfButton.classList.add('btn', 'btn-primary');
        pdfButton.onclick = () => downloadPdfReport(reportId);

        // Create Excel download button
        const excelButton = document.createElement('button');
        excelButton.textContent = `Download Excel Report for ${reportTitle}`;
        excelButton.classList.add('btn', 'btn-primary');
        excelButton.onclick = () => downloadExcelReport(reportId);

        // Append buttons to the report container
        reportContainer.appendChild(pdfButton);
        reportContainer.appendChild(excelButton);

        // Append the report container to the reports container
        document.getElementById('reports-container').appendChild(reportContainer);
    });
}

// Function to download PDF report
function downloadPdfReport(reportId) {
    // Make a fetch request to download PDF report
    fetch(`/admin/report/pdf/${reportId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.blob();
        })
        .then(blob => {
            const url = window.URL.createObjectURL(new Blob([blob]));
            const a = document.createElement('a');
            a.href = url;
            a.download = `report_${reportId}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        })
        .catch(error => console.error('Error downloading PDF report:', error));
}

// Function to download Excel report
function downloadExcelReport(reportId) {
    fetch(`/admin/report/excel/${reportId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.blob();
        })
        .then(blob => {
            const url = window.URL.createObjectURL(new Blob([blob]));
            const a = document.createElement('a');
            a.href = url;
            a.download = `report_${reportId}.xlsx`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        })
        .catch(error => console.error('Error downloading Excel report:', error));
}
// Function to fetch user data from the server
function fetchUserData() {
    fetch('/user/data')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            return response.json();
        })
        .then(data => {
            // Render user data
            renderUserData(data);
        })
        .catch(error => {
            console.error('Error fetching user data:', error);
        });
}


// Function to fetch daily reports from the server
function fetchDailyReports() {
    fetch('/daily-report/data')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            return response.json();
        })
        .then(data => {
            // Render daily reports
            renderDailyReports(data);
        })
        .catch(error => {
            console.error('Error fetching daily reports:', error);
        });
}


