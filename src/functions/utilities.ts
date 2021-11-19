import { Command } from '@sapphire/framework'
import { container } from '@sapphire/pieces'
import { CommandInteraction, MessageEmbedOptions, TextChannel } from 'discord.js'
import got from 'got/dist/source'
import { errorDetails } from '../types/misc'

export default class Utilities {
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

	public random(max: number): number {
		return Math.floor(Math.random() * max)
	}

	public now(): number {
		return Math.round(Date.now() / 1000)
	}

	public getAllCommands(): string[] {
		const allCommands = []
		for (const c of container.stores.get('commands')) {
			allCommands.push(c[1])
		}

		const notOwnerCommands = allCommands.filter(
			(c) => !c.options.preconditions?.includes('ownerOnly')
		)

		const commands: string[] = []
		notOwnerCommands.forEach((c) => {
			commands.push(c.name)
		})

		return commands
	}

	public getCommand(id: string): Command | undefined {
		const allCommands = []
		for (const c of container.stores.get('commands')) {
			allCommands.push(c[1])
		}

		return allCommands.find((c) => c.name === id)
	}

	public parseInteractionArgs(interaction: CommandInteraction) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const options: any = {}
		interaction.options.data.forEach((option) => {
			switch (option.type) {
				case 'STRING':
					options[option.name] = option.value
					break
				case 'INTEGER':
					options[option.name] = option.value
					break
				case 'BOOLEAN':
					options[option.name] = option.value
					break
				case 'NUMBER':
					options[option.name] = option.value
					break
				case 'USER':
					options[option.name] = { user: option.user, member: option.member }
					break
				case 'CHANNEL':
					options[option.name] = option.channel
					break
				case 'ROLE':
					options[option.name] = option.role
					break
				case 'MENTIONABLE':
					options[option.name] = option.role
						? option.role
						: { user: option.user, member: option.member }
					break
				case 'SUB_COMMAND':
					options['subcommand'] = option.name
					option.options?.forEach((subOption) => {
						switch (subOption.type) {
							case 'STRING':
								options[subOption.name] = subOption.value
								break
							case 'INTEGER':
								options[subOption.name] = subOption.value
								break
							case 'BOOLEAN':
								options[subOption.name] = subOption.value
								break
							case 'NUMBER':
								options[subOption.name] = subOption.value
								break
							case 'USER':
								options[subOption.name] = {
									user: subOption.user,
									member: subOption.member,
								}
								break
							case 'CHANNEL':
								options[subOption.name] = subOption.channel
								break
							case 'ROLE':
								options[subOption.name] = subOption.role
								break
							case 'MENTIONABLE':
								options[subOption.name] = subOption.role
									? subOption.role
									: { user: subOption.user, member: subOption.member }
								break
						}
					})
					break
				case 'SUB_COMMAND_GROUP': {
					options['subcommandGroup'] = option.name

					// @ts-ignore
					const suboptions = option.options[0].options

					options['subcommand'] = (
						option.options as { name: string; type: string }[]
					)[0].name

					// @ts-ignore
					suboptions.forEach((subOption) => {
						switch (subOption.type) {
							case 'STRING':
								options[subOption.name] = subOption.value
								break
							case 'INTEGER':
								options[subOption.name] = subOption.value
								break
							case 'BOOLEAN':
								options[subOption.name] = subOption.value
								break
							case 'NUMBER':
								options[subOption.name] = subOption.value
								break
							case 'USER':
								options[subOption.name] = {
									user: subOption.user,
									member: subOption.member,
								}
								break
							case 'CHANNEL':
								options[subOption.name] = subOption.channel
								break
							case 'ROLE':
								options[subOption.name] = subOption.role
								break
							case 'MENTIONABLE':
								options[subOption.name] = subOption.role
									? subOption.role
									: { user: subOption.user, member: subOption.member }
								break
						}
					})
					break
				}
			}
		})

		return options
	}
}
