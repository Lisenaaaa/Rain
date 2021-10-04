import chalk from 'chalk'
import { RainListener } from '@extensions/RainListener'
import database from '@functions/database'
import Handler from '@functions/handler'
import { perms } from '@src/types/misc'

export default class ReadyListener extends RainListener {
	constructor() {
		super('ready', {
			emitter: 'client',
			event: 'ready',
		})
	}

	async exec() {
		const guilds = await database.getEntireGuildsDB()
		guilds.forEach((g) => {
			const allCommands = Handler.getAllCommands()
			let allGuildCommands = g.commandSettings
			const guildCommandsArray: string[] = []

			allGuildCommands.forEach(c => {
				guildCommandsArray.push(c.id)
			})

			allGuildCommands.forEach((guildCommand) => {
				if (!allCommands.includes(guildCommand.id)) {
					allGuildCommands = allGuildCommands.filter((c) => c.id != guildCommand.id)
					console.log(chalk`{red Removed} {magenta ${guildCommand.id}} {red from ${g.guildID}'s database entry'}`)
				}
			})

			allCommands.forEach(c => {
				if (guildCommandsArray.includes(c)) return

				const permissions = Handler.getCommand(c)?.defaultPerms

				const command = { id: c, enabled: true, lockedRoles: (permissions as perms), lockedChannels: [] }

				g.commandSettings.push(command)
				console.log(chalk`{blue Added} {magenta ${command.id}} {blue from ${g.guildID}'s database entry'}`)
			})
		})

		console.log(chalk`{magenta Logged in as} {magentaBright.bold ${this.client.user?.tag}}`)
		console.log(`\n`)
		console.log(chalk.magentaBright(`---Bot Output---\n`))

		this.client.user?.setActivity('Lisena create me', { type: 'WATCHING' })
	}
}
