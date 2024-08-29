const puppeteer = require('puppeteer-extra');
const stealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(stealthPlugin())

const { executablePath } = require('puppeteer');

const { timeout } = require('puppeteer');
const { randomDelay, loginLinkedIn } = require('./precautions/antiBotDetection.js')
const { saveData, getSavedData} = require('./data/saveJobPost.js')


/** 
 * Main of the Puppeteer
 * @param {number} jobName - Job name you want to find
 * @param {number} jobLocation - Location of the Job you want to find
 * @returns {object} - List of Jobs
 */
const scrapeJobPosts = async (pageNum, browser, url ,excludedCompanies) => {
    console.log('Scraping Linkedin. . .')
    
    const page = await browser.newPage();
    
    // const link = `https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?keywords=${jobName}&location=${jobLocation}&geoId=&trk=public_jobs_jobs-search-bar_search-submit&original_referer=&start=0`;
    
    try {
        await page.goto(url,{ waitUntil: 'networkidle2' })
    
        // I Can use DOM with these :)
        const grabJobId = await page.evaluate(() => {
            const baseCardDiv = document.querySelectorAll('li div.base-card'); 
            const jobId = Array.from(baseCardDiv).map(job => {
                return job.getAttribute('data-entity-urn').split(':')[3];
            })
            return jobId;
        });

        const getJobInfo = async () => {
            const avoidedJobCompanyList = []
            const jobPostList = [];
            let numOfJobsFind = 0;
            for (const jobId of grabJobId){
                let jobUrl = `https://www.linkedin.com/jobs-guest/jobs/api/jobPosting/${jobId}`;
                
                try {
                    await page.goto(jobUrl,{ waitUntil: 'networkidle2'});
                    await page.waitForSelector('section.top-card-layout',{timeout: 10000});
                } catch(error) {
                    continue;
                }

                const jobPost = await page.evaluate(() => {
                    const getJobTitle = () => {
                        try {
                            return document.querySelector('h2.top-card-layout__title')?.textContent?.trim() || null;
                        } catch(error) {
                            return null
                        }
                    }

                    const getCompanyName = () => {
                        try {
                            return document.querySelector('a.topcard__org-name-link')?.textContent?.trim() || null;;
                        } catch(error) {
                            return null
                        }
                    }

                    const getTimePosted = () => {
                        try {
                            return document.querySelector('span.posted-time-ago__text.topcard__flavor--metadata')?.textContent?.trim() || null;
                        } catch(error) {
                            return null
                        }
                    }

                    const getJobSearchLocation = () => { 
                        try {
                            return document.querySelector('span.topcard__flavor.topcard__flavor--bullet')?.textContent?.trim() || null;
                        } catch(error) {
                            return null
                        }
                    }

                    const getApplicationStatus = () => {
                        try {
                            return document.querySelector('figure.num-applicants__figure')?.textContent?.trim() || null;
                        } catch(error) {
                            return null
                        }
                    }

                    const getDirectLinkedInLink = () => { 
                        try {
                            return document.querySelector('a.topcard__org-name-link')?.href || null
                        } catch(error) {
                            return null
                        }
                    }

                    return {
                        jobTitle: getJobTitle(),
                        companyName: getCompanyName(),
                        timePosted: getTimePosted(),
                        jobSearchLocation: getJobSearchLocation(),
                        applicantsStatus: getApplicationStatus(),
                        directLinkedInLink: getDirectLinkedInLink()
                    }
                });
                
                // Sorts Companies need to avoid
                const avoid = (jobPost, companyToAvoid) => jobPost.companyName.toLowerCase().split(' ').join('') === companyToAvoid.toLowerCase().split(' ').join('');

                const hasExcludedCompanies = excludedCompanies.length !== 0;

                if (hasExcludedCompanies) {
                    // Per Scraped Job Post it checks if companyName in blackList of Companies
                    const isExclude = excludedCompanies.some(companyToAvoid => avoid(jobPost, companyToAvoid))

                    if (isExclude) {
                        avoidedJobCompanyList.push(jobPost)
                    } else {
                        jobPostList.push(jobPost)
                    }
                } else {
                    jobPostList.push(jobPost)
                }
                
                numOfJobsFind++;
                console.log(`Found ${numOfJobsFind} Job. . .`)
                await randomDelay(2000,4000)
            }
            return {posts: jobPostList, companyAvoided: avoidedJobCompanyList};
        };

        const jobs = await getJobInfo();

        if (jobs.posts.length !== 0 && jobs.posts) {
            console.log(`Page ${pageNum + 1} sucessfuly scraped ${jobs.posts.length} job Posts`)
            await page.close()
            return jobs
        } else {
            console.log(`Page ${pageNum + 1} didnt find any Job Post Results`)
            await page.close()
        }
        
    } catch(error) {
        await page.close()
    }
};

/**
 * it compiles all resolves by the ` Promise ` into one Array or Data's
 * @param {Array} result Fresh Scraoed data 
 * @returns 
 */
const compileScrapedData = (result) => {
    const jobWhiteList = [];
    const jobBlackList = [];

    //Spreader Operator :), slighlty similar to args* in python but it helps to combine a list or elements within the array
    result.forEach(job => {
        jobWhiteList.push(...job.posts)
        jobBlackList.push(...job.companyAvoided)
    })

    return {whiteList: jobWhiteList, blackList: jobBlackList}
}

/**
 * Parallel Scraping :D
 * @param {object} urlPages - List of Pages need to be scraped
 */
const scrapeMultiplePages = async (urlPages, excludedCompanies) => {
    
    const browser = await puppeteer.launch({headless: false, executablePath: executablePath()});
    await loginLinkedIn(browser);
    const result = await Promise.all(
        urlPages.map((url, index) => scrapeJobPosts(index , browser, url, excludedCompanies))
    );
    
    if (result) {
        const filteredData = result.filter(search => search !== undefined);
        const compiledData = compileScrapedData(filteredData);
        await browser.close()
        return compiledData
    }
    console.log('Oops . . . looks like no result found')
    await browser.close()
}

/**
 * 
 * @param {string} jobName 
 * @param {string} jobLocation 
 * @param {number} maxPage 
 * @returns 
 */
const getMainPages = (jobName, jobLocation, maxPage) => {
    const pageLinks = []
    for (let page = 0; page < maxPage ; page++) {
      const pageNum = page * 15
      const pageUrl = `https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?keywords=${jobName}&location=${jobLocation}&geoId=&trk=public_jobs_jobs-search-bar_search-submit&original_referer=&start=${pageNum}`;
      pageLinks.push(pageUrl)
    }
    return pageLinks
}

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

/**
 * The Great Job Hunter - this function needs a asynchronous function in order to properly work ^_^
 * @param {string} jobName Job title or name of the job you want to find
 * @param {string} jobLocation Location of your job to where to find
 * @param {Array} excludedCompanies Companies that you dont want to see
 * @param {number} maxPage Maximum number of pages need to be scraped (maxPage is 4 for now)
 * @returns {Promise<Array>} Returns a resolved list of job listings or Posts
 */
const callTheJobHunter = async (jobName, jobLocation, excludedCompanies = [], maxPage = 3, ) => {
    if (paramsIsValid(jobName, jobLocation, maxPage, excludedCompanies)) {
        const pageLinks = getMainPages(jobName, jobLocation, maxPage)
        const scrapedJobs = await scrapeMultiplePages(pageLinks, excludedCompanies)
        console.log(scrapedJobs.whiteList)
        saveData(scrapedJobs.whiteList)
        return scrapedJobs;
    }
    console.log('Invalid Parameter')
}

// In python this is the javascript version of ` if '__name__' == '__main__':
if (require.main === module) {
    ( async () => {
        const jobs = await callTheJobHunter('Game Development', "Philippines", ['playnetic','Ubisoft philippines'])
    })();
}

module.exports = { callTheJobHunter }

/*
* Reference:
* Youtube - Advanced Web Scraping with Puppeteer: Avoid Looking Like a Bot and Pass Authentication || https://youtu.be/9zwyfrVv3hg?si=ftG6XPRPWdIRZl3E
? Youtube - How to Scrape LinkedIn 2024: Link Found in Reddit kaso dikona mahanap yung Reddit Post :,D
* Youtube - Tutorial for Puppeteer: Web Scraping With Javascript (Puppeteer Tutorial) || https://youtu.be/Sag-Hz9jJNg?si=JOrbI8LLejE0oaFD
*/