const { email } = require('./account/linkedInEmail')
const { password } = require('./account/linkedInPassword')

// Just for a quick test
const checkBot = async (browser) => {
    const page = await browser.newPage()
    await page.goto('https://bot.sannysoft.com/')

    await page.screenshot({path: 'test_bot.jpg'})
}

/**
 * Logins to linked in to not to be detect as a guest or Outsider on the site
 * @param {*} browser
 */
const loginLinkedIn = async (browser) => {
    try {
        const page = await browser.newPage()
        console.log('Logging In on Linked In. . .')
        await page.setUserAgent(randomUserAgent())
        await page.goto("https://www.linkedin.com/checkpoint/lg/sign-in-another-account")
    
        await page.type('#username',email, {delay: 100});
        await page.type('#password',password, {delay: 100});
    
        await page.click('button[aria-label="Sign in"]');
        console.log('Successed Logged In')
    } catch(error) {
        console.log('Failed to Login into Linked In')
    }
}

/**
 * Per Scrape it picks Random User Agent per Scrape
 * @returns 
 */
const randomUserAgent = () => {
    const userAgents = [
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.5845.111 Safari/537.36",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.5845.111 Safari/537.36",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:117.0) Gecko/20100101 Firefox/117.0",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:117.0) Gecko/20100101 Firefox/117.0",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.5845.111 Safari/537.36 Edg/116.0.1938.76",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Safari/605.1.15",
        "Mozilla/5.0 (Linux; Android 13; Pixel 6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.5845.111 Mobile Safari/537.36",
        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.5845.111 Safari/537.36",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.5845.111 Safari/537.36 OPR/101.0.4843.58"
    ];
    
    const pickUserAgent = Math.floor(Math.random() * userAgents.length)
    return userAgents[pickUserAgent]
}

/**
 * It delays every querySelector in a second to avoid continous scraping
 * It helps also to mimic real user browsing through the site by delaying
 * @param {number} min minimum seconds
 * @param {number} max maximum seconds
 * @returns 
 */
const randomDelay= (min,max) => {
    const delay = Math.floor(Math.random() * (max - min + 1)) + min;
    return new Promise(resolve => setTimeout(resolve, delay));
}

if (require.main ===  module) {
    checkBot()
}

module.exports = { randomDelay, loginLinkedIn , checkBot, randomUserAgent}