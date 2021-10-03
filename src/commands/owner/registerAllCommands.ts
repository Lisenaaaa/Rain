// import { RainCommand } from '@extensions/RainCommand'
// import commandManager from '@functions/commandManager'
// import database from '@functions/database'
// import chalk from 'chalk'
// import { Message } from 'discord.js'

// export default class RegisterAllNewCommands extends RainCommand {
// 	constructor() {
// 		super('registerAllNewCommands', {
// 			aliases: ['registerAllNewCommands'],
// 			ownerOnly: true,
// 		})
// 	}
// 	async exec(message: Message) {
// 		const commandIDs = await commandManager.getAllCommandIDs()

// 		const dbIDs: string[] = []
// 		await database.readCommandGlobal().then((db) => {
// 			db.forEach((command: { id: string; enabled: boolean }) => {
// 				dbIDs.push(command.id)
// 			})
// 		})

// 		const missingFromDB = commandIDs.filter((cmdID) => !dbIDs.includes(cmdID))

// 		missingFromDB.forEach((id) => {
// 			database.addCommandToGlobalDB(id)
// 			console.log(chalk`{blue Added {magenta ${id}} to the database!}`)
// 			message.reply(`Added ${id} to the database!`)
// 		})
// 	}
// }
