const puppeteer = require('puppeteer-extra');
const stealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(stealthPlugin())

const { randomDelay, loginLinkedIn, randomUserAgent } = require('../precautions/antiBotDetection.js');
const { executablePath } = require('puppeteer');

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
        await page.setUserAgent(randomUserAgent())
        await page.goto(url,{ waitUntil: 'networkidle2' })
    
        // I Can use DOM with these :)
        const grabJobId = await page.evaluate(() => {
            const baseCardDiv = document.querySelectorAll('li div.base-card'); 
            const jobId = Array.from(baseCardDiv).map(job => {
                return job.getAttribute('data-entity-urn').split(':')[3];
            })
            return jobId;
        });

        const jobs = await getJobInfo(page, grabJobId, excludedCompanies);

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
 * Scrapes through job post informations
 * @returns 
 */
const getJobInfo = async (page, jobIdList, excludedCompanies) => {
    const avoidedJobCompanyList = []
    const jobPostList = [];
    let numOfJobsFind = 0;
    for (const jobId of jobIdList){
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
                    return document.querySelector('figure.num-applicants__figure')?.textContent?.trim() || document.querySelector('span.num-applicants__caption.topcard__flavor--metadata.topcard__flavor--bullet')?.textContent?.trim() || 'No Information';
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
 * * TODO: 
 * ! Add sorting Function for a specific job post Hunting
 * ! Enable existing Data filter
 * 
 */
module.exports = { scrapeMultiplePages, getMainPages }