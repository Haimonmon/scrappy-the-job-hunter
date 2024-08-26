const prompt = require("prompt-sync")();
const { callMrOwOTheJobHunter } = require("./MrScrappy/scraper")

const displayJobInfo = (job) => {
    console.log('-'.repeat(40),'\n');
    console.log('Job Title: ',job.jobTitle);
    console.log('Company Name: ',job.companyName);
    console.log('Time Posted: ',job.timePosted);
    console.log('Job Search Location: ',job.jobSearchLocation)
    console.log('Applicants Status: ',job.applicantsStatus);
    console.log('Company Linked In Link: ',job.directLinkedInLink)
    console.log('-'.repeat(40),'\n');
}

const handleFindJobChoice = (jobSearch) => {
    console.log('[1] Try Search Again\n[2] Search New Job\n[3] Exit');
    const choice = prompt('Choice: ');
    switch (choice) {
        case '1':
            findJob(jobSearch.title, jobSearch.location) //retry to search again
            break;
        case '2':
            findJob()
            break;
        case '3':
            jobFinder();
            break;
        default:
            console.log('Invalid Choice')
            handleFindJobChoice(jobSearch) // Retry for Invalid Option
    }
}

const checkFindJobParameter = (jobTitle, jobLocation) => {
    if (!(jobTitle && jobLocation)) {
        const askJobTitle = prompt('Job Title: ');
        const askJobLocation = prompt('Job Location: ')
        return {title: askJobTitle, location: askJobLocation}
    } else {
        return {title: jobTitle, location: jobLocation}
    }   
}

const findJob = async (jobTitle = null, jobLocation = null) => {
    console.clear()
    const jobSearch = checkFindJobParameter(jobTitle,jobLocation)
    console.log('-'.repeat(40))
    
    const jobs = await callMrOwOTheJobHunter(jobSearch.title,jobSearch.location)
    if (jobs.length !== 0) {
        jobs.forEach(displayJobInfo)
    } else {
        console.log('No Found Jobs . . .')
    }

    console.log('-'.repeat(40))
    handleFindJobChoice(jobSearch)
}

const savedJobs = () => {
    console.log('Saved Jobs Page Coming Soon.')
    jobFinder()
}

const handleJobFinderUserChoice = () => {
    choice = prompt('Choice: ')
    switch (choice) {
        case '1':
            findJob()
            break;
        case '2':
            savedJobs()
            break;
        case '3':
            console.log('Thank you for visiting. . .')
            break;
        default:
            console.log('Invalid Choice')
            jobFinder()
            break;
    }
}

/**
 * Job Finder is still on Development
 */
const jobFinder = () => {
    console.clear()
    console.log('[ Job Finder Name ]');
    console.log('[1] Find Latest Jobs\n[2] Saved Jobs\n[3] Exit');
    handleJobFinderUserChoice();
};

// TODO: Make a checkConnection Function
jobFinder()