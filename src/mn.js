// 爬图片

const puppeteer = require('puppeteer')
const { mnDir } = require('./config/default')
const srcToImg = require('./utils/srcToImg')

class Mn {
	constructor(mnDir) {
		this.mnDir = mnDir
	}

	async start () {
		let browser
		try {
			browser = await puppeteer.launch()
			let page = await browser.newPage()
			await page.goto('https://cn.bing.com/images/trending')

			console.log('go to')

			await page.setViewport({
				width: 1920,
				height: 2080
			});

			await page.focus('#sb_form_q')
			await page.keyboard.sendCharacter('美女')
			await page.click('#sb_form_go')



			page.on('load', async () => {
				try {
					console.log('page loading done, start fetch')
	
					let srcs = await page.evaluate(() => {
						const images = document.querySelectorAll('.mimg')
						return Array.prototype.map.call(images, img => img.src)
					})
	
					console.log(`get ${srcs.length} iamges, start download`)
	
	
					//TODO forEach 异步 有点问题的
					srcs.forEach(async (src) => {
						await page.waitFor(Math.random() * 200)
						await srcToImg(src, this.mnDir)
					})
				} catch (error) {
					console.log(error)
				} finally {
					browser && await browser.close()
				}

			})

		} catch (error) {
			console.log(error)
		} 
	}
}

let mn = new Mn(mnDir)
mn.start()