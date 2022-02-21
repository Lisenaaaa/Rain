import { Command, Listener } from '@sapphire/framework'
import { container } from '@sapphire/pieces'
import {
	BaseCommandInteraction,
	CacheType,
	CommandInteraction,
	CommandInteractionOption,
	GuildBasedChannel,
	GuildMember,
	MessageActionRow,
	MessageButton,
	MessageEmbedOptions,
	Role,
	TextChannel,
	User,
} from 'discord.js'
import got from 'got/dist/source'
import { ErrorDetails, Perms } from '../types/misc'
import moment from 'moment'
import { APIInteractionDataResolvedChannel, APIInteractionDataResolvedGuildMember, APIRole } from 'discord-api-types'

export default class Utilities {
	/**
	 * @param content The object you want to put on a haste server.
	 * @returns The haste link, or `"Couldn't post."` if it failed to post it.
	 */
	public async haste(content: string): Promise<string> {
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

	/**
	 * @param error The `Error` object.
	 * @param details The details for the error.
	 * @returns Sends a message in the error channel, and returns a more user-friendly embed.
	 */
	public async error(error: Error, details: ErrorDetails): Promise<MessageEmbedOptions> {
		const errorChannel = container.client.channels.cache.get(container.settings.errorChannel) as TextChannel
		const id = `${this.random(696969696969)}`

		await errorChannel.send({
			embeds: [
				{
					title: `An error occured!`,
					fields: [
						{
							name: 'Details',
							value: `Type: ${details.type}${details.data.link ? `\n${details.data.link}` : ''}${details.data.note ? `\nNote: ${details.data.note}` : ''}`,
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
			description: `${details.data.note ? `**${details.data.note}**\n` : ''}This error has been automatically reported to my developer. Please give her this ID: \`${id}\``,
			color: 'RED',
		}
	}

	/**
	 * @param max The maximum the random number generator can generate.
	 * @returns A random number.
	 */
	public random(max: number): number {
		return Math.floor(Math.random() * max) + 1
	}

	/**
	 * @returns The current timestamp, in the proper formatting for Discord's <t:timestamp:> formatting
	 */
	public now(type: 'seconds' | 'milliseconds'): number {
		return type === 'seconds' ? Math.floor(Date.now() / 1000) : Date.now()
	}

	/**
	 * @returns An array of all command IDs
	 */
	public getAllCommands(): string[] {
		const allCommands = []
		for (const c of container.stores.get('commands')) {
			allCommands.push(c[1])
		}

		const notOwnerCommands = allCommands.filter((c) => !c.options.preconditions?.includes('ownerOnly'))

		const commands: string[] = []
		notOwnerCommands.forEach((c) => {
			commands.push(c.name)
		})

		return commands
	}

	/**
	 * @param id The ID of the command you want to fetch.
	 * @returns The command object.
	 */
	public getCommand(id: string): Command | undefined {
		return container.stores.get('commands').get(id)
	}

	public getListener(id: string): Listener | undefined {
		const allListeners = []
		for (const [, l] of container.stores.get('listeners')) {
			allListeners.push(l)
		}

		return allListeners.find((l) => l.name === id)
	}

	/**
	 * @param interaction The command interaction you want to parse for options.
	 * @returns The args from the interaction, in the same formatting as `discord-akairo` has them.
	 */
	public parseInteractionArgs<T>(interaction: CommandInteraction): T {
		const options: Record<
			string,
			string | number | boolean | { user: User; member: GuildMember | APIInteractionDataResolvedGuildMember } | GuildBasedChannel | APIInteractionDataResolvedChannel | Role | APIRole
		> = {}
		interaction.options.data.forEach((option) => {
			switch (option.type) {
				case 'STRING':
					options[option.name] = option.value!
					break
				case 'INTEGER':
					options[option.name] = option.value!
					break
				case 'BOOLEAN':
					options[option.name] = option.value!
					break
				case 'NUMBER':
					options[option.name] = option.value!
					break
				case 'USER':
					options[option.name] = { user: option.user!, member: option.member! }
					break
				case 'CHANNEL':
					options[option.name] = option.channel!
					break
				case 'ROLE':
					options[option.name] = option.role!
					break
				case 'MENTIONABLE':
					options[option.name] = option.role ? option.role : { user: option.user!, member: option.member! }
					break
				case 'SUB_COMMAND':
					options['subcommand'] = option.name
					option.options?.forEach((subOption) => {
						switch (subOption.type) {
							case 'STRING':
								options[subOption.name] = subOption.value!
								break
							case 'INTEGER':
								options[subOption.name] = subOption.value!
								break
							case 'BOOLEAN':
								options[subOption.name] = subOption.value!
								break
							case 'NUMBER':
								options[subOption.name] = subOption.value!
								break
							case 'USER':
								options[subOption.name] = { user: subOption.user!, member: subOption.member! }
								break
							case 'CHANNEL':
								options[subOption.name] = subOption.channel!
								break
							case 'ROLE':
								options[subOption.name] = subOption.role!
								break
							case 'MENTIONABLE':
								options[subOption.name] = subOption.role ? subOption.role : { user: subOption.user!, member: subOption.member! }
								break
						}
					})
					break
				case 'SUB_COMMAND_GROUP': {
					options['subcommandGroup'] = option.name

					const suboptions = (option.options as CommandInteractionOption<CacheType>[])[0].options

					options['subcommand'] = (option.options as { name: string; type: string }[])[0].name
					;(suboptions as CommandInteractionOption<CacheType>[]).forEach((subOption) => {
						switch (subOption.type) {
							case 'STRING':
								options[subOption.name] = subOption.value!
								break
							case 'INTEGER':
								options[subOption.name] = subOption.value!
								break
							case 'BOOLEAN':
								options[subOption.name] = subOption.value!
								break
							case 'NUMBER':
								options[subOption.name] = subOption.value!
								break
							case 'USER':
								options[subOption.name] = { user: subOption.user!, member: subOption.member! }
								break
							case 'CHANNEL':
								options[subOption.name] = subOption.channel!
								break
							case 'ROLE':
								options[subOption.name] = subOption.role!
								break
							case 'MENTIONABLE':
								options[subOption.name] = subOption.role ? subOption.role : { user: subOption.user!, member: subOption.member! }
								break
						}
					})
					break
				}
			}
		})

		return options as unknown as T
	}

	timeFormatted(format?: string) {
		return moment().format(format ?? 'YYYY-MM-DD hh:mm:ss A')
	}

	/**
	 * @param perms1 The first perms value.
	 * @param perms2 The second perms value.
	 * @returns If the first perms value is higher than the second perms value.
	 */
	checkPermHeirarchy(perms1: Perms, perms2: Perms) {
		const permsMap = {
			owner: 6,
			admin: 5,
			srMod: 4,
			moderator: 3,
			helper: 2,
			trialHelper: 1,
			none: 0,
		}

		const p1 = permsMap[perms1]
		const p2 = permsMap[perms2]

		return p1 >= p2
	}

	/**
	 *
	 * @param array The array you'd like to split.
	 * @param number The number of objects in each array it outputs.
	 * @returns An array of arrays, where each array is part of the input array.
	 */
	splitArrayIntoMultiple<T>(array: T[], number: number) {
		const outputArray = []
		let fakeOutputArray
		while (array.length > 0) {
			fakeOutputArray = array.splice(0, number)
			outputArray.push(fakeOutputArray)
		}
		return outputArray
	}

	/**
	 * @param interaction The interaction you want to reply to
	 * @param embeds An array of embeds, to use for the pages. This will overwrite whatever was set as the `footer` for each embed.
	 */
	async paginate(interaction: BaseCommandInteraction, embeds: MessageEmbedOptions[]) {
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
			new MessageButton().setEmoji('<:paginate1:903780818755915796>').setCustomId('pageBackAll').setStyle('PRIMARY'),
			new MessageButton().setEmoji('<:paginate2:903780882203160656>').setCustomId('pageBackOne').setStyle('PRIMARY'),
			new MessageButton().setEmoji('<:paginate3:903780978940596295>').setCustomId('pageForwardsOne').setStyle('PRIMARY'),
			new MessageButton().setEmoji('<:paginate4:903781017544953966>').setCustomId('pageForwardsAll').setStyle('PRIMARY'),
		])
		const msg = await interaction.reply({ embeds: [newEmbeds[0]], components: [buttonRow], fetchReply: true })

		const interactionCollector = interaction.channel?.createMessageComponentCollector({ time: 60000 })

		interactionCollector?.on('collect', async (button) => {
			if (!button.isButton()) return
			if (button.user.id != interaction.user.id) return await button.deferUpdate()

			switch (button.customId) {
				case `pageBackAll|${msg.id}`: {
					currentPage = 1
					await button.deferUpdate()
					await interaction.editReply({ embeds: [newEmbeds[0]] })
					break
				}
				case `pageBackOne|${msg.id}`: {
					if (currentPage === 1) {
						await button.deferUpdate()
						break
					}
					currentPage -= 1
					await button.deferUpdate()
					await interaction.editReply({ embeds: [newEmbeds[currentPage - 1]] })
					break
				}
				case `pageForwardsOne|${msg.id}`: {
					if (currentPage === pages) currentPage = pages
					else currentPage += 1
					await button.deferUpdate()
					await interaction.editReply({ embeds: [newEmbeds[currentPage - 1]] })
					break
				}
				case `pageForwardsAll|${msg.id}`: {
					currentPage = pages - 1
					await button.deferUpdate()
					await interaction.editReply({ embeds: [newEmbeds[pages - 1]] })
					break
				}
			}
		})
		interactionCollector?.once('end', async () => {
			const buttonRowDisabled = new MessageActionRow().addComponents([
				new MessageButton().setEmoji('<:paginate1:903780818755915796>').setCustomId('pageBackAll').setStyle('PRIMARY').setDisabled(true),
				new MessageButton().setEmoji('<:paginate2:903780882203160656>').setCustomId('pageBackOne').setStyle('PRIMARY').setDisabled(true),
				new MessageButton().setEmoji('<:paginate3:903780978940596295>').setCustomId('pageForwardsOne').setStyle('PRIMARY').setDisabled(true),
				new MessageButton().setEmoji('<:paginate4:903781017544953966>').setCustomId('pageForwardsAll').setStyle('PRIMARY').setDisabled(true),
			])
			const reply = await interaction.fetchReply()
			await interaction.editReply({ embeds: reply.embeds, components: [buttonRowDisabled] })
		})
	}

	/**
	 * @param string A string, in any capitalization format.
	 * @returns That same string, but with the first character capitalized and the rest in lowercase.
	 */
	nameFormat(string: string): string {
		string = string.toLowerCase()
		const newString = string.split('')
		newString[0] = newString[0].toLocaleUpperCase()
		string = newString.join('')
		return string
	}

	getObjectDifferences(object1: Record<string, unknown>, object2: Record<string, unknown>) {
		const finalObject: Record<string, unknown> = {}
		for (const key of Object.keys(object1)) {
			if (Object.keys(object2).includes(key)) {
				if (object1[key] != object2[key]) {
					finalObject[key] = [object1[key], object2[key]]
				}
			}
		}

		return finalObject
	}
}
