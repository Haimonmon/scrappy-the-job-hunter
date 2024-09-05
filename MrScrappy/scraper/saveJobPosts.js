const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');
const prompt = require('prompt-sync')();
const { data } = require('../data/exampleData1');
const { title } = require('process');

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
 * @param {Array} getExistingData
 * @param {Array} dataToAdd 
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

const updateData = (changedData, job) => {
    changedData.timePosted = job.timePosted
    changedData.applicantsStatus = job.applicantsStatus
}

/**
 * It Filters Outdated data by replacing the old data into a new one
 * @param {*} getExistingData 
 * @param {*} removedRedundantDatas 
 * @returns 
 */
const checkChanges = (getExistingData, removedRedundantDatas) => {
    let numOfDataChange = 0;

    const filter = removedRedundantDatas.filter(job => {
        return !getExistingData.some(changedData => {
            const isSameJob = fixData(changedData.jobTitle) === fixData(job.jobTitle) &&
            fixData(changedData.companyName) === fixData(job.companyName) &&
            fixData(changedData.jobSearchLocation) === fixData(job.jobSearchLocation)

            const dataIsOutdated = changedData.timePosted !== job.timePosted || changedData.applicantsStatus !== job.applicantsStatus;

            // Checks if Job have a same data except on timePosted and applicantStatus, It is a sign of an Outdated Data
            if (isSameJob && dataIsOutdated) {
                updateData(changedData, job)
                numOfDataChange++
                return true
            }
            return false
        })
    })

    numOfDataChange ? console.log(`⬆️.  ${numOfDataChange} Data has been updated.`) : console.log('✅ All data are up to Date.')
    return filter
}

/**
 * It filters out the data has been existed and data that needs only to be Updated will be also filtered out
 * @param {*} getExistingData  Data in existed file excel
 * @param {*} dataToAdd New Data to be added
 * @returns 
 */
const filterData = (getExistingData, dataToAdd) => {
    // 1st stage of filtering same Data
    const removedRedundantDatas = avoidRedundancy(getExistingData, dataToAdd)

    // 2nd stage of filtering and Updating existing Data
    const changedData = checkChanges(getExistingData, removedRedundantDatas);

    return changedData
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

    const filteredData = filterData(getExistingData, dataToAdd)

    //appending/ adding data to the json, concatenation 
    const updatedData = getExistingData.concat(filteredData);

    // convert the updated data to worksheet again and ready to replace the excel file data
    const updateWorkSheet = XLSX.utils.json_to_sheet(updatedData)

    workbook.Sheets[sheetName] = updateWorkSheet;

    filteredData.length ? console.log(`⬆️. ${filteredData.length} New Data has been added.`) : console.log('✅ No New Data has been added.')
    XLSX.writeFile(workbook, filePath)
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
    
    // Checks if file is existed
    if (fs.existsSync(filePath)) {
        addData(data, filePath)
    } else {
        createNewExcelFile(filePath, data)
    } 
}

//if __name__ == '__main__': :D
if (require.main === module) {
    const data = [
        {
            jobTitle: 'Unity Level Integrator',
            companyName: 'Limit Break',
            timePosted: '23 hours ago',
            jobSearchLocation: 'Manila National Capital Region, Philippines',
            applicantsStatus: 'Be among the first 25 applicants',
            directLinkedInLink: 'https://www.linkedin.com/company/limit-break/?trk=public_jobs_topcard-org-name'
          },
          {
            jobTitle: 'Game Tester Opportunity!',
            companyName: 'TransPerfect',
            timePosted: '2 month ago',
            jobSearchLocation: 'Philippines',
            applicantsStatus: 'Over 100 applicants',
            directLinkedInLink: 'https://www.linkedin.com/company/transperfect?trk=public_jobs_topcard-org-name'
          },
          {
            jobTitle: 'Game Tester',
            companyName: 'GoTeam',
            timePosted: '5 weeks ago',
            jobSearchLocation: 'Philippines',
            applicantsStatus: 'Over 200 applicants',
            directLinkedInLink: 'https://www.linkedin.com/company/goteamph?trk=public_jobs_topcard-org-name'
          },
          {
            jobTitle: 'Unity Game Developer',
            companyName: 'BreederDAO',
            timePosted: '1 month ago',
            jobSearchLocation: 'Philippines',
            applicantsStatus: 'Over 200 applicants',
            directLinkedInLink: 'https://www.linkedin.com/company/breederdao?trk=public_jobs_topcard-org-name'
          },
    ]

    saveData(data)
}

module.exports = { saveData, getSavedData }