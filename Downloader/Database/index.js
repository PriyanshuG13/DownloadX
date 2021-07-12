// const puppeteer = require("puppeteer")

// async function scrapperPuppeteer(url) {
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();
//     await page.goto(url)

//     const [el] = await page.$x('/html/body/div[1]/div[1]/table/tbody/tr[1]/td[3]/a[2]')
//     const link = await el.getProperty('href')
//     const magnet = await link.jsonValue()

//     console.log(magnet)
//     browser.close();
// }

// scrapperPuppeteer('https://nyaa.iss.one')

const DatabaseManager = require('./Database/DatabaseManager.js')
const Downloader = require('./Downloader.js')
