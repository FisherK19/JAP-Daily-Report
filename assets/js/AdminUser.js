function downloadPdfReport(userId) {
    fetch(`/admin/report/pdf/${userId}`)
        .then(response => {
            if (response.ok) return response.blob();
            throw new Error('Network response was not ok.');
        })
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = `report_${userId}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        })
        .catch(error => console.error('Error downloading the file:', error));
}

function downloadExcelReport(userId) {
    window.location.href = `/admin/report/excel/${userId}`;
}
