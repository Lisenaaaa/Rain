import chalk from 'chalk'
import { RainListener } from '@extensions/RainListener'
import database from '@functions/database'
import Handler from '@functions/handler'
import { RainGuild } from '@extensions/discord.js/Guild'

export default class ReadyListener extends RainListener {
	constructor() {
		super('ready', {
			emitter: 'client',
			event: 'ready',
		})
	}

	async exec() {
		console.log(chalk`{magenta Logged in as} {magentaBright.bold ${this.client.user?.tag}}`)
		console.log(`\n`)
		console.log(chalk.magentaBright(`---Bot Output---\n`))

		const allCommands = Handler.getAllCommands()

		//@ts-ignore
		this.client.guilds.cache.forEach(async (guild: RainGuild) => {
			await guild.registerCommands()
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

		await this.client.user?.setActivity('Lisena create me', { type: 'WATCHING' })

		this.client.taskHandler.startAll()
	}
}
