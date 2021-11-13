import { container } from '@sapphire/pieces'
import { MessageEmbedOptions, TextChannel } from 'discord.js'
import got from 'got/dist/source'
import { errorDetails } from '../types/misc'

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

	public async error(error: Error, details: errorDetails): Promise<MessageEmbedOptions> {
		const errorChannel = container.client.channels.cache.get(
			container.config.errorChannel
		) as TextChannel
		const id = `${this.random(696969696969)}`

		await errorChannel.send({
			embeds: [
				{
					title: `An error occured!`,
					fields: [
						{
							name: 'Details',
							value: `Type: ${details.type}${
								details.data.messageOptions
									? `\n(Message Link)[https://discord.com/${details.data.messageOptions.guildID}/${details.data.messageOptions.channelID}/${details.data.messageOptions.messageID}]`
									: ''
							}${details.data.note ? `\nNote: ${details.data.note}` : ''}`,
							inline: true,
						},
						{ name: 'ID', value: id, inline: true },
					],
					description: `\`\`\`js\n${error.stack}\`\`\``,
					color: 'RED',
				},
			],
		})

		return {
			title: `A(n) ${details.type} error occured!`,
			description: `${
				details.data.note ? `**${details.data.note}**\n` : ''
			}This error has been automatically reported to my developer. Please give her this ID: \`${id}\``,
			color: 'RED',
		}
	}

	public random(max: number) {
		return Math.floor(Math.random() * max)
	}

	public now() {
		return Math.round(Date.now() / 1000)
	}

	public getAllCommands() {
		console.log([...container.stores.get('commands').keys()])
	}
}
