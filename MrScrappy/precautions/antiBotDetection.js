const { email } = require('./account/linkedInEmail')
const { password } = require('./account/linkedInPassword')

const checkBot = async (browser) => {
    const page = await browser.newPage()
    await page.goto('https://bot.sannysoft.com/')

    await page.screenshot({path: 'test_bot.jpg'})
}

const loginLinkedIn = async (browser) => {
    const page = await browser.newPage()
    await page.goto("https://www.linkedin.com/checkpoint/lg/sign-in-another-account")

    await page.type('#username',email, {delay: 100});
    await page.type('#password',password, {delay: 100});

    await page.click('button[aria-label="Sign in"]');
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

module.exports = { randomDelay, loginLinkedIn }