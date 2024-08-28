const XLSX = require('xlsx');

// Example data - an array of objects
const data = [
    { JobTitle: "Software Engineer", Company: "owoowoowowoowoowowoowoowoooo", Location: "New York" },
    { JobTitle: "Data Analyst", Company: "Data Inc", Location: "San Francisco" },
    // Add more objects as needed
];

// Step 1: Convert your data to a worksheet
const worksheet = XLSX.utils.json_to_sheet(data);

// Step 2: Create a new workbook and add the worksheet to it
const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook, worksheet, "Jobs");

// Step 3: Write the workbook to an Excel file
XLSX.writeFile(workbook, "scrapedData.xlsx");

console.log("Data saved to scrapedData.xlsx");

