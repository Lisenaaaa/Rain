import chalk from 'chalk'
import { RainListener } from '@extensions/RainListener'
import commandManager from '@functions/commandManager'
import database from '@functions/database'
import { RainCommand } from '@extensions/RainCommand'

class ReadyListener extends RainListener {
	constructor() {
		super('ready', {
			emitter: 'client',
			event: 'ready',
		})
	}

	async exec() {
		// let globalCommandDB: [] = []
		// try {
		// 	globalCommandDB = await database.readCommandGlobal()
		// } catch (error) {
		// 	console.error(chalk.red(`Failed to connect to MongoDB.\n${error.stack}`))
		// 	//process.exit()
		// }
		console.log(chalk`{magenta Logged in as} {magentaBright.bold ${this.client.user?.tag}}`)
		console.log(`\n`)
		console.log(chalk.magentaBright(`---Bot Output---\n`))

		// const logChannel = this.client.channels.cache.get('839215645715595316') as TextChannel
		// logChannel.send(`Logged in as **${this.client.user.tag}**`)

		this.client.user?.setActivity('Lisena create me', { type: 'WATCHING' })

		//check if all commands are in the DB, and add missing ones

		// const commandIDs = await commandManager.getAllCommandIDs()
		//commandIDs = []

		// eslint-disable-next-line prefer-const
		// let dbIDs: string[] = []

		// globalCommandDB.forEach((command: RainCommand) => {
		// 	dbIDs.push(command.id)
		// })

		// const missingFromDB = commandIDs.filter((cmdID) => !dbIDs.includes(cmdID))

		// missingFromDB.forEach((id) => {
		// 	database.addCommandToGlobalDB(id)
		// 	console.log(chalk`{blue Added {magenta ${id}} to the database!}`)
		// })

		//check if there are commands in the DB that aren't in the bot
		// const missingFromBot = dbIDs.filter((dbID) => !commandIDs.includes(dbID))

		// missingFromBot.forEach((id) => {
		// 	database.deleteCommandFromGlobalDB(id)
		// 	console.log(chalk`{red Removed {magenta ${id}} from the database!}`)
		// })
	}
}

module.exports = ReadyListener
