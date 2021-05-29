import chalk from 'chalk';
import { Listener } from 'discord-akairo';
import { BotListener } from '../extensions/BotListener';

class customCommand extends BotListener {
    constructor() {
        super('customCommand', {
            emitter: 'client',
            event: 'message'
        });
    }

    exec(message) {
        const command = `.e`
        const response = `eee`

        if (message.content == command && message.author.bot == false) {
            message.channel.send(response)
        }
    }
}

module.exports = customCommand;