import { container } from '@sapphire/pieces'
import { MessageEmbedOptions } from 'discord.js'
import got from 'got/dist/source'

export default class Utilities {
	public async haste(content: string) {
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

	public async error(error: Error, details?: string): Promise<MessageEmbedOptions> {
		const errorChannel = await container.client.channels.cache.get(container.config.errorChannel)

		console.log(errorChannel)

		return {}
	}
}

container.utils = new Utilities()