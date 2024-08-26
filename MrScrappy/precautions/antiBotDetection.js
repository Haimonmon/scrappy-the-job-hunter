const { email } = require('../account/linkedInEmail')
const { password } = require('../account/linkedInPassword')

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

const checkLoginPage = () => {

}

module.exports = { randomDelay }