const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');
const prompt = require('prompt-sync')();


const createData = (filePath, data) => {
    // Step 1: Convert your data to a worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Step 2: Create a new workbook and add the worksheet to it
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Jobs");

    // Step 3: Write the workbook to an Excel file
    XLSX.writeFile(workbook, filePath);

    console.log("Data saved to scrapedData.xlsx");
}

const avoidRedundancy = (getExistingData, dataToAdd) => {
    return dataToAdd.filter(job => {
        return !getExistingData.some(existingJob => {
            existingJob.JobTitle === job.JobTitle && existingJob.Company === job.Company && existingJob.Location === job.Location
        });
    });
}

const addData = (dataToAdd, filePath) => {
    
    const workbook = XLSX.readFile(filePath)
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]

    // turn excel sheet into json first
    const getExistingData = XLSX.utils.sheet_to_json(worksheet)

    avoidRedundancy(getExistingData, dataToAdd)

    //appending data to the json
    const updatedData = getExistingData.concat(dataToAdd);

    // convert the updated data to worksheet again
    const updateWorkSheet = XLSX.utils.json_to_sheet(updatedData)

    workbook.Sheets[sheetName] = updateWorkSheet;

    XLSX.writeFile(workbook, filePath)
}

const getSavedData = () => {
    const filePath = path.join(__dirname, 'scrapedData.xlsx')
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    const data = XLSX.utils.sheet_to_json(worksheet)

    return data
}


const saveData = (data) => {
    const filePath = path.join('./MrScrappy/data', 'scrapedData.xlsx')

    if (fs.existsSync(filePath)) {
        addData(data, filePath)
    } else {
        createData(filePath, data)
    } 

    console.table(getSavedData())
}

if (require.main === module) {
    const data = [
        { JobTitle: "Game Development", Company: "owoowoowowoowoowowoowoowoooo", Location: "New York" },
        { JobTitle: "Data Analysticiter", Company: "Data Inc", Location: "San Francisco" },
    ];
    saveData(data)
}

module.exports = { getSavedData }