const puppeteer = require('puppeteer-extra');
const stealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(stealthPlugin())

const { executablePath } = require('puppeteer');
const { timeout } = require('puppeteer');
const { randomDelay } = require('./precautions/antiBotDetection.js')


/** 
 * Main of the Puppeteer
 * @param {number} jobName - Job name you want to find
 * @param {number} jobLocation - Location of the Job you want to find
 * @returns {object} - List of Jobs
 */
const scrapeJobPosts = async (pageNum, browser,url) => {
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
                jobPostList.push(jobPost);
                numOfJobsFind++;
                console.log(`Found ${numOfJobsFind} Job. . .`)
                await randomDelay(1000,3000)
            }
            return jobPostList;
        };

        const jobs = await getJobInfo();
        
        if (jobs.length !== 0 && jobs) {
            console.log(`Page ${pageNum} sucessfuly scraped ${jobs.length} job Posts`)
            return jobs
        }
    } catch(error) {
        console.log(error)
        await page.close()
    }
};

/**
 * Parallel Scraping :D
 * @param {object} urlPages - List of Pages need to be scraped
 */
const scrapeMultiplePages = async (urlPages) => {
    const browser = await puppeteer.launch({headless: false, executablePath: executablePath()});
    const result = await Promise.all(
        urlPages.map(url => scrapeJobPosts(urlPages.indexOf(url), browser,url))
    );
    await browser.close()
    return result.filter(search => search !== undefined)
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
 * The Great Job Hunter
 * @param {string} jobName - Job title or name of the job you want to find
 * @param {string} jobLocation - Location of your job to where to find 
 * @param {number} maxPage - Maximum number of pages need to be scraped
 */
const callMrOwOTheJobHunter = async (jobName, jobLocation, maxPage = 3) => {
    const pageLinks = getMainPages(jobName, jobLocation, maxPage)
    const scrapedJobs = await scrapeMultiplePages(pageLinks)
    return scrapedJobs;
}

// In python this is the javascript version of ` if '__name__' == '__main__':
if (require.main === module) {
    callMrOwOTheJobHunter('Teacher','Toronto, Ontario, Canada')
}

module.exports = { callMrOwOTheJobHunter }
// TODO: Bugs to fix, Empty Array return due to login page of Linked In during the start of Scraping Process

/*
Reference:
Youtube - Advanced Web Scraping with Puppeteer: Avoid Looking Like a Bot and Pass Authentication || https://youtu.be/9zwyfrVv3hg?si=ftG6XPRPWdIRZl3E
Youtube - How to Scrape LinkedIn 2024: Link Found in Reddit kaso dikona mahanap yung Reddit Post :,D
Youtube - Tutorial for Puppeteer: Web Scraping With Javascript (Puppeteer Tutorial) || https://youtu.be/Sag-Hz9jJNg?si=JOrbI8LLejE0oaFD
*/