import chalk from 'chalk'
import { BotListener } from '@extensions/BotListener'
import commandManager from '@functions/commandManager'
import database from '@functions/database'

class ReadyListener extends BotListener {
    constructor() {
        super('ready', {
            emitter: 'client',
            event: 'ready'
        });
    }

    async exec() {
        console.log(chalk.magenta(`Bot Online!`))
        console.log(`\n`)
        console.log(chalk.magentaBright(`---Bot Output---\n`))

        this.client.user.setActivity('Zordlan create me', { type: 'WATCHING' })

        //check if all commands are in the DB, and add missing ones

        let commandIDs = await commandManager.getAllCommandIDs(this.client)
        //commandIDs = []

        let dbIDs = []
        await database.readCommandGlobal().then(db => {
            db.forEach(command => {
                dbIDs.push(command.id)
            })
        })

        const missingFromDB = commandIDs.filter(cmdID => !dbIDs.includes(cmdID))

        missingFromDB.forEach(id => {
            database.addCommandToGlobalDB(id)
            console.log(chalk`{blue Added {magenta ${id}} to the database!}`)
        })

        //check if there are commands in the DB that aren't in the bot
        const missingFromBot = dbIDs.filter(dbID => !commandIDs.includes(dbID))

        missingFromBot.forEach(id => {
            database.deleteCommandFromGlobalDB(id)
            console.log(chalk`{red Removed {magenta ${id}} from the database!}`)
        })
    }
}

module.exports = ReadyListener