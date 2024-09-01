const { scrapeMultiplePages, getMainPages } = require('./scrapeJobPosts.js');
const { saveData, getSavedData} = require('./saveJobPosts.js');

/**
 * Checks if the ` callTheJobHunter() ` function parameter is valid
 * @param {*} jobName 
 * @param {*} jobLocation 
 * @param {*} maxPage 
 * @param {*} excludedCompanies 
 * @returns 
 */
const paramsIsValid = (jobName, jobLocation, maxPage, excludedCompanies) => {
    // Checks if the Maxpage is an Whole number or Integer and the max page limit is 5 for browser effeciency
    const isMaxPageWholeNumber = typeof maxPage === 'number' && maxPage === Math.floor(maxPage) && maxPage <= 4;

    // Checks if jobName and Joblocation is a string
    const isJobsValidStrings = typeof jobName === 'string' && typeof jobLocation === 'string';

    // Checks if excludedCompanies is an Array
    const isExcludedCompaniesAnArray = Array.isArray(excludedCompanies) && excludedCompanies !== null;

    // if list is not empty it Checks the array elements if its a string or if list just empty it just return true 
    const checkArrayElement = (list) => isExcludedCompaniesAnArray && list.length !== 0 ? list.every(element => typeof element === 'string') : true;  

    return isMaxPageWholeNumber && isJobsValidStrings && isExcludedCompaniesAnArray && checkArrayElement(excludedCompanies)
}

const filterScrape = (maxPage = 3, owo = 'hello') => {
    console.log(maxPage)
}

/**
 * The Great Job Hunter - this function needs a asynchronous function in order to properly work ^_^
 * @param {string} jobName Job title or name of the job you want to find
 * @param {string} jobLocation Location of your job to where to find
 * @param {Array} excludedCompanies Companies that you dont want to see
 * @param {number} maxPage Maximum number of pages need to be scraped (maxPage is 4 for now)
 * @returns {Promise<Array>} Returns a resolved list of job listings or Posts
 */
const enableJobHunt = async (jobName, jobLocation, excludedCompanies = [], maxPage = 3, ) => {
    if (paramsIsValid(jobName, jobLocation, maxPage, excludedCompanies)) {
        const pageLinks = getMainPages(jobName, jobLocation, maxPage)
        const scrapedJobs = await scrapeMultiplePages(pageLinks, excludedCompanies)
        console.log(scrapedJobs.blackList)
        saveData(scrapedJobs.whiteList)
        return scrapedJobs;
    }
    console.log('Invalid Parameter')
}

// In python this is the javascript version of ` if '__name__' == '__main__':
if (require.main === module) {
    ( async () => {
        const jobs = await enableJobHunt('Game Development', "Toronto")
    })();
}

module.exports = { enableJobHunt }

/*
* Reference:
* Youtube - Advanced Web Scraping with Puppeteer: Avoid Looking Like a Bot and Pass Authentication || https://youtu.be/9zwyfrVv3hg?si=ftG6XPRPWdIRZl3E
? Youtube - How to Scrape LinkedIn 2024: Link Found in Reddit kaso dikona mahanap yung Reddit Post :,D
* Youtube - Tutorial for Puppeteer: Web Scraping With Javascript (Puppeteer Tutorial) || https://youtu.be/Sag-Hz9jJNg?si=JOrbI8LLejE0oaFD
*/