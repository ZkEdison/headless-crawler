const fs  = require('fs')
const http = require('http')
const https = require('https')
const path = require('path')
const {URL} = require('url')
const {promisify} = require('util')

const writeFilePromise = promisify(fs.writeFile)

async function srcToImg (src, dir) {
	try {
		if (!src) {
			return
			// throw new Error('src 不能为空')
		}
		console.log('src')
		src = src.trim()
		if (/^http/.test(src)) {
			await urlToImg(src, dir)
		} else {
			await base64ToImg(src, dir)
		}
	} catch (error) {
		console.log(error)
	}
}

// url -> img
function urlToImg(url, dir) {
	return new Promise((resolve, reject) => {
		try {
			let mod = /^https:/.test(url) ? https : http
			let curUrl = new URL(url)
			let ext = path.extname(curUrl.pathname || '')
			let file = path.join(dir, `${Date.now()}.${ext || 'jpg'}`)
			mod.get(url, res => {
				console.log('res')
				res.pipe(fs.createWriteStream(file))
					 .on('finish', () => {
						 console.log('finish')
						resolve(file)
					 })
			})
		} catch (error) {
			reject(error)
		}
	})
}

// base64 -> image

function base64ToImg(base64Str, dir) {
	return new Promise(async (resolve, reject) => {
		base64Str = base64Str.trim()
		// data:image/jpeg;base64,/asdasda

		
		try {
			let matches = base64Str.match(/^data:(.+?);base64,(.+)$/)

			let mimeType = matches[1] && matches[1].split('/')
			let ext  = mimeType[1].replace('jpeg', 'jpg')
			let file = path.join(dir, `${Date.now()}.${ext}`)
			await writeFilePromise(file, matches[2], 'base64')
			resolve(file)
		} catch (error) {
			reject(error)
		}
	})
}


module.exports = srcToImg