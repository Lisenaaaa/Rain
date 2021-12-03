/* eslint-disable no-mixed-spaces-and-tabs */ // Prettier triggers this. I hate my life.
import { SlashCommand } from './SlashCommandPiece'
import { Store } from '@sapphire/framework'
import { Constructor } from '@sapphire/utilities'
import { Guild } from 'discord.js'
import chalk from 'chalk'

export class SlashCommandStore extends Store<SlashCommand> {
	constructor() {
		super(SlashCommand as Constructor<SlashCommand>, { name: 'slashCommands' })
	}

	async registerCommands() {
		const client = this.container.client
		if (!client) return console.log(chalk.red('No client found.'))

		const [guildCommands, globalCommands] = this.container.stores
			.get('slashCommands')
			.partition((c) => c.guilds != undefined)

		const guilds = await client.guilds.fetch()
		for (const [id] of guilds) {
			const guild = client.guilds.cache.get(id) as Guild

			const cmds = guildCommands.filter(
				(c) => c.guilds === undefined || c.guilds.includes(id)
			)

			const commands = []
			for (const [, command] of cmds) {
				commands.push(command.commandData)
			}

			await guild.commands.set(commands)
		}

		const globalCmds = []
		for (const [, command] of globalCommands) {
			globalCmds.push(command.commandData)
		}

		if (this.container.config.env === 'development') {
			globalCmds.length === 0
				? ''
				: console.log(
						chalk`{red Skipping global commands:} {magenta ${globalCmds.map(
							(c) => c.name
						)}}`
				  )
			return
		}

		await client.application?.commands.set([])
		await client.application?.commands.set(globalCmds)
	}
}
