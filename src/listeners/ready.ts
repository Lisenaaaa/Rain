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
		const allCommands = Handler.getAllCommands()
		guilds.forEach(async (g) => {
			let allGuildCommands = g.commandSettings
			const guildCommandsArray: string[] = []

			allGuildCommands.forEach(c => {
				guildCommandsArray.push(c.id)
			})

			allGuildCommands.forEach((guildCommand) => {
				if (!allCommands.includes(guildCommand.id)) {
					allGuildCommands = allGuildCommands.filter((c) => c.id != guildCommand.id)
					console.log(chalk`{red Removed} {magenta ${guildCommand.id}} {red from ${g.guildID}'s database entry}`)
				}
			})

			allCommands.forEach(c => {
				if (allGuildCommands.find(cmd => cmd.id === c)) return

				const permissions = Handler.getCommand(c)?.defaultPerms

				const command = { id: c, enabled: true, lockedRoles: (permissions as perms), lockedChannels: [] }

				g.commandSettings.push(command)
				console.log(chalk`{blue Added} {magenta ${command.id}} {blue to ${g.guildID}'s database entry}`)
			})

			await database.editGuild(g.guildID, 'commandSettings', allGuildCommands)
		})
		allCommands.forEach(async cmd => {
			const allDBCommands = await database.getEntireCommandsDB()
			if (!allDBCommands.find(c => c.commandID === cmd)) {
				if (await database.addCommand(cmd) === false) {
					console.log(chalk`{red Failed to add} {red.bold ${cmd}} {red to the global database.}`)
					return process.exit()
				}
				console.log(chalk`{green Added} {greenBright ${cmd}} {green to the global database.}`)
			}
		})

		console.log(chalk`{magenta Logged in as} {magentaBright.bold ${this.client.user?.tag}}`)
		console.log(`\n`)
		console.log(chalk.magentaBright(`---Bot Output---\n`))

		this.client.user?.setActivity('Lisena create me', { type: 'WATCHING' })
	}
}
