import got from 'got/dist/source'
import { inspect } from 'util'

async function haste(content: string) {
	const urls = [
		'https://h.inv.wtf',
		'https://hst.sh',
		'https://hasteb.in',
		'https://hastebin.com',
		'https://mystb.in',
		'https://haste.clicksminuteper.net',
		'https://paste.pythondiscord.com',
		'https://haste.unbelievaboat.com',
	]

	for (const url of urls) {
		try {
			const body: never = await got
				.post(`${url}/documents`, {
					body: content,
					responseType: 'json',
				})
				.json()

			return `${url}/${body['key']}`
		} catch (err) {
			continue
		}
	}
	return "Couldn't post."
}

export default {
	haste,
}
