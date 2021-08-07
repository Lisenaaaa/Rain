import chalk from 'chalk';
import { BotCommand } from '@extensions/BotCommand';
import database from '@functions/database';
import commandManager from '@functions/commandManager';
import { Message } from 'discord.js';

export default class registerAllNewCommands extends BotCommand {
    constructor() {
        super('registerAllNewCommands', {
            aliases: ['registerAllNewCommands'],
            ownerOnly: true
        })
    }
    async exec(message:Message) {
        const commandIDs = await commandManager.getAllCommandIDs()

        const dbIDs: any[] = []
        await database.readCommandGlobal().then(db => {
            db.forEach((command:any) => {
                dbIDs.push(command.id)
            })
        })

        const missingFromDB = commandIDs.filter(cmdID => !dbIDs.includes(cmdID))

        missingFromDB.forEach(id => {
            database.addCommandToGlobalDB(id)
            console.log(chalk`{blue Added {magenta ${id}} to the database!}`)
            message.reply(`Added ${id} to the database!`)
        })
    }
}