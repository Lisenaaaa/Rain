import { SlashCommand } from './SlashCommandPiece'
import { Store } from '@sapphire/framework'
import { Constructor } from '@sapphire/utilities'

export class SlashCommandStore extends Store<SlashCommand> {
	constructor() {
		super(SlashCommand as Constructor<SlashCommand>, { name: 'slashCommands' })
	}

	async registerCommands() {
		const client = this.container.client
		if (!client) return

		// This will split the slash commands between global and guild only.
		const slashCommands = this.container.stores.get('slashCommands')

		// eslint-disable-next-line no-unsafe-optional-chaining
		const [guildc, globalc] = slashCommands?.partition((c) => c.guildOnly)

		const guildCmds = guildc.map((c) => c.commandData)
		const globalCmds = globalc.map((c) => c.commandData)

		// iterate to all connected guilds and apply the commands.
		const guilds = await client?.guilds?.fetch() // retrieves Snowflake & Oauth2Guilds
		for (const [id] of guilds) {
			const guild = await client?.guilds?.fetch(id) // gets the guild instances from the cache (fetched before)
			await guild.commands.set([])
			let commands = guildCmds
			const guildOnlyCommands = []

			for (const cmd of commands) {
				if (cmd.guilds) {
					commands = commands.filter((c) => c != cmd)

					if (cmd.guilds.includes(guild.id)) {
						guildOnlyCommands.push(cmd)
					}
				}
			}
			const allCommands = [...guildOnlyCommands, ...commands]

			await guild.commands.set(allCommands)
		}

		if (this.container.config.env === 'development') {
			this.container.logger.info("Skipped global commands because we're in development mode")
			return
		}

		// This will register global commands.
		await client.application?.commands.set([])
		await client.application?.commands.set(globalCmds)
	}
}
