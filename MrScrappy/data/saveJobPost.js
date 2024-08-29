const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');
const prompt = require('prompt-sync')();
const { data } = require('./exampleData')

/** Creates new Data
 * @param {string} filePath File Path to place the excel data
 * @param {Array} data First Data to be added along with the new excel file :)
 */
const createNewExcelFile = (filePath, data) => {
    // Convert your data to a worksheet

    const worksheet = XLSX.utils.json_to_sheet(data);

    // Create a new workbook and add the worksheet to it
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Jobs");

    // Write the workbook to an Excel file
    XLSX.writeFile(workbook, filePath);

    console.log("Data saved to scrapedData.xlsx");
}

const fixData = (data) => {
    return (data || '').toLowerCase().split(' ').join('');
}

/**
 * It filters out the same or redundant Data on the New Data
 * @param {Array} getExistingData Data in existed file excel
 * @param {Array} dataToAdd New Data to be added
 * @returns 
 */
const avoidRedundancy = (getExistingData, dataToAdd) => {
    // True = the job will remain on the Element, thats why it uses exlamation to convert false into true | !false
    // False = the job existed on the data will be remove by the filter, if condition true it will turn into false | !true
    return dataToAdd.filter(job => {
        return !getExistingData.some(existingJob => {
            const fix = fixData(existingJob.jobTitle) === fixData(job.jobTitle) && 
            fixData(existingJob.companyName) === fixData(job.companyName) && 
            fixData(existingJob.timePosted) === fixData(job.timePosted) &&
            fixData(existingJob.jobSearchLocation) === fixData(job.jobSearchLocation) &&
            fixData(existingJob.applicantsStatus) === fixData(job.applicantsStatus)
            return fix
        });
    });
}

/** Adds new Data to the existed Excel File
 * @param {Array} dataToAdd data to be added on the existed Excel File
 * @param {*} filePath file path of the existed excel File
 */
const addData = (dataToAdd, filePath) => {
    
    const workbook = XLSX.readFile(filePath)
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]

    const getExistingData = XLSX.utils.sheet_to_json(worksheet)

    const filteredData = avoidRedundancy(getExistingData, dataToAdd)

    if (filteredData.length !== 0) {
        //appending/ adding data to the json, concatenation 
        const updatedData = getExistingData.concat(filteredData);

        // convert the updated data to worksheet again and ready to replace the excel file data
        const updateWorkSheet = XLSX.utils.json_to_sheet(updatedData)

        workbook.Sheets[sheetName] = updateWorkSheet;
        console.log('New Data has been added.')
        XLSX.writeFile(workbook, filePath)
    } else {
        console.log('No New Data has been added.')
    }
}

/**
 * 
 * @returns 
 */
const getSavedData = () => {
    const filePath = path.join(__dirname, 'scrapedData.xlsx')
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    const data = XLSX.utils.sheet_to_json(worksheet)

    return data
}

/**
 * Saves data
 * @param {*} data 
 */
const saveData = (data) => {
    const filePath = path.join('./MrScrappy/data', 'scrapedData.xlsx')
   
    if (fs.existsSync(filePath)) {
        addData(data, filePath)
    } else {
        createNewExcelFile(filePath, data)
    } 
}

//if __name__ == '__main__': :D
if (require.main === module) {
    
    saveData(data)
}

module.exports = { saveData, getSavedData }