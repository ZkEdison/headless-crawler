// 网页截图

const {screenshotDir} = require('./config/default')
const puppeteer = require('puppeteer')


class ScreenShot {
	constructor(screenshotDir) {
		this.screenshotDir = screenshotDir
	}

	async start () {
		let browser
		try {
			browser = await puppeteer.launch()
			const page = await browser.newPage()
			await page.goto('https://www.imooc.com/')
			await page.screenshot({
				path: `${this.screenshotDir}/${Date.now()}.png`,
				type: 'png',
				fullPage: true
			})
			
		} catch (error) {
			console.log(error)
		} finally {
			await browser.close();
		}
	}
}

let screenshot = new ScreenShot(screenshotDir)
screenshot.start()