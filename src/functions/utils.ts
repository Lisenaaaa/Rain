import chalk from 'chalk'
import { GuildMember, Message, MessageActionRow, MessageButton, MessageEmbed, MessageEmbedOptions } from 'discord.js'
import got from 'got/dist/source'
import config from '@src/config/config'
import { inspect } from 'util'
import { modlogs } from '@src/types/misc'
import { RainMessage } from '@extensions/akairo/AkairoMessage'
import client from '..'

export default class Utils {
	static slashGuilds = ['824680357936103497', '780181693100982273', '794610828317032458', '859172615892238337', '880637463838724166']

	static async haste(content: string) {
		const output = inspect(content, { depth: 0 })
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
						body: output,
						responseType: 'json',
					})
					.json()

				return `${url}/${body['key']}`
			} catch (err) {
				continue
			}
		}
		return "Couldn't post"
	}

	static async hasteJson<T>(content: T): Promise<string> {
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
						body: JSON.stringify(content, null, 4),
						responseType: 'json',
					})
					.json()

				const key = body['key']

				return `${url}/${key}`
			} catch (err) {
				continue
			}
		}
		return "Couldn't post"
	}

	static async sleep(time: number) {
		return new Promise((resolve) => setTimeout(resolve, time))
	}

	static async getObjectDifferences(object1: Record<string, unknown>, object2: Record<string, unknown>, thingToCheck = `all`) {
		if (thingToCheck == 'all') {
			//difference between the objects
			const firstObjectKeys = Object.keys(object1)
			const secondObjectKeys = Object.keys(object2)

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const object: any = {}

			firstObjectKeys.forEach((key: string) => {
				if (secondObjectKeys.includes(key)) {
					if (object1[key] != object2[key]) {
						object[key] = {
							object1: object1[key],
							object2: object2[key],
						}
					}
				}
			})
			return object
		} else {
			//difference between one specific thing in the objects
		}
	}

	static debug(thingToLog: string) {
		console.log(chalk`{bgRed DEBUG:} ${thingToLog}`)
	}

	async getRolePriority(user: GuildMember, otherperson: GuildMember) {
		let rolePriority = false

		if (user.roles.highest.rawPosition > otherperson.roles.highest.rawPosition) {
			rolePriority = true
		} else if (user.roles.highest.rawPosition == otherperson.roles.highest.rawPosition) {
			rolePriority = false
		} else {
			rolePriority = false
		}

		return rolePriority
	}

	//this is stolen from javascript docs
	static getRandomInt(max = 10) {
		return Math.floor(Math.random() * max)
	}

	static splitArrayIntoMultiple<T>(array: T[], number: number) {
		const outputArray = []
		let fakeOutputArray
		while (array.length > 0) {
			fakeOutputArray = array.splice(0, number)
			outputArray.push(fakeOutputArray)
		}
		return outputArray
	}

	static funnyNumber(number: number) {
		const num = `${number}`

		if (num.includes('69') || num.includes('420') || num.includes('69420') || num.includes('42096')) {
			return true
		} else {
			return false
		}
	}

	static regExpEscape(string: string) {
		return string.replace(/[-[\]{}()*+!<=:?./\\^$|#\s,]/g, '\\$&')
	}

	static censorString(string: string): string {
		Object.keys(config).forEach((key: string) => {
			const configObject = config[key as keyof typeof config]

			Object.keys(configObject).forEach((key: string) => {
				const fuckRegex = new RegExp(this.regExpEscape(configObject[key as keyof typeof configObject]), 'g')
				if (key === 'tokenToUse') {
					return
				}
				string = string.replace(fuckRegex, key)
			})
		})

		return string
	}

	static get currentTimestamp() {
		return Math.round(Date.now() / 1000)
	}

	/**
	 * @param interaction The interaction to reply to.
	 * @param embeds An array of embeds, to use for the pages. This will overwrite whatever was set as the `footer` for each embed.
	 */
	static async paginate(message: RainMessage, embeds: MessageEmbedOptions[]) {
		const length = embeds.length
		let currentPage = 1
		const newEmbeds: MessageEmbedOptions[] = []

		let pages = 0
		for (const embed of embeds) {
			pages += 1
			embed.footer = { text: `Page ${pages} of ${length}` }
			newEmbeds.push(embed)
		}

		const buttonRow = new MessageActionRow().addComponents([
			new MessageButton().setLabel('back all').setCustomId('pageBackAll').setStyle('PRIMARY'),
			new MessageButton().setLabel('back 1').setCustomId('pageBackOne').setStyle('PRIMARY'),
			new MessageButton().setLabel('forwards 1').setCustomId('pageForwardsOne').setStyle('PRIMARY'),
			new MessageButton().setLabel('forwards all').setCustomId('pageForwardsAll').setStyle('PRIMARY'),
		])
		await message.interaction.reply({ embeds: [newEmbeds[0]], components: [buttonRow] })

		const interactionCollector = message.channel?.createMessageComponentCollector({ time: 60000 })

		interactionCollector?.on('collect', async (button) => {
			if (!button.isButton()) return
			if (button.user.id != message.author.id) return await button.deferUpdate()

			switch (button.customId) {
				case 'pageBackAll': {
					currentPage = 1
					await button.deferUpdate()
					await message.interaction.editReply({ embeds: [newEmbeds[0]] })
					break
				}
				case 'pageBackOne': {
					if (currentPage === 1) break
					currentPage -= 1
					await button.deferUpdate()
					await message.interaction.editReply({ embeds: [newEmbeds[currentPage - 1]] })
					break
				}
				case 'pageForwardsOne': {
					if (currentPage === pages) currentPage = pages
					else currentPage += 1
					await button.deferUpdate()
					await message.interaction.editReply({ embeds: [newEmbeds[currentPage - 1]] })
					break
				}
				case 'pageForwardsAll': {
					currentPage = pages - 1
					await button.deferUpdate()
					await message.interaction.editReply({ embeds: [newEmbeds[pages - 1]] })
					break
				}
			}
		})
	}
}
