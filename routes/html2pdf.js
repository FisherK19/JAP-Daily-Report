$(document.body).on("click", "html2PDF", function(e) {
    e.preventDefault();
  console.log("clicked");
   let element = document.querySelector('dailyReport');
  
    let opt = {
      margin:10,
      filename: 'dailyReport.pdf',
      html2canvas: {
        scale: 1,
        scrollX: true,
        scrollY: true,
        useCORS: true
      },
      jsPDF: {unit:'mm',format:'A3', orientation:'p'}
    };
  
  
    html2pdf().set(opt).from(element).save();
  });

// $(document.body).on("click", "#html2PDF", function(e) {
//     e.preventDefault();
//   console.log("clicked");
//    let element = document.getElementById('dailyReport');
//    console.log(element);
  
// //     let opt = {
// //       margin:10,
// //       filename: 'dailyReport.pdf',
// //       html2canvas: {
// //         scale: 1,
// //         scrollX: true,
// //         scrollY: true,
// //         useCORS: true
// //       },
// //       jsPDF: {unit:'mm',format:'A3', orientation:'p'}
// //     };
  
  
// //     html2pdf().set(opt).from(element).save();
//   });

// document.body.addEventListener("click", function(e) {
//     // Check if the clicked element has the ID "html2PDF"
//     if (e.target && e.target.id === "html2PDF") {
//         e.preventDefault(); // Prevent default behavior (e.g., if it's a button or link)
//         console.log("clicked");

//         // Get the element with the ID "dailyReport"
//         // let element = document.getElementById('dailyReport');
//     //    console.log(element);

//         // Uncomment the following section when you're ready to use html2pdf
//         // let opt = {
//         //     margin: 10,
//         //     filename: 'dailyReport.pdf',
//         //     html2canvas: {
//         //         scale: 1,
//         //         scrollX: true,
//         //         scrollY: true,
//         //         useCORS: true
//         //     },
//         //     jsPDF: {unit: 'mm', format: 'A3', orientation: 'p'}
//         // };

//         // html2pdf().set(opt).from(element).save();
//     }
// });


document.body.addEventListener("click", function(e) {
    console.log(e.target); // Check what element you're clicking
    if (e.target && e.target.id === "html2PDF") {
        e.preventDefault();
        console.log("clicked");
    }
});
