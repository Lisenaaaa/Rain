import chalk from 'chalk';
import { Listener } from 'discord-akairo';
import { BotListener } from '../extensions/BotListener';

class ReadyListener extends BotListener {
    constructor() {
        super('ready', {
            emitter: 'client',
            event: 'ready'
        });
    }

    exec() {
        console.log(chalk.magenta(`Bot Online!`))
        console.log(`\n`)
        console.log(chalk.magentaBright(`---Bot Output---\n`))

        this.client.user.setActivity('Zordlan create me', { type: 'WATCHING' })

        //check if all commands are in the DB
        //console.log(this.client.commandHandler.categories)
    }
}

module.exports = ReadyListener;