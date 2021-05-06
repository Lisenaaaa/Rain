import { Listener } from 'discord-akairo';
import { BotListener } from '../../extensions/BotListener';

class tags extends BotListener {
    constructor() {
        super('tags', {
            emitter: 'client',
            event: 'message'
        });
    }

    exec(message) {
        let prefix = "!"
        let tagName = "hi"

        let tagOutput = "Hello!"

        if (message.content == `${prefix}${tagName}` && message.author.bot == false) {
            message.channel.send(tagOutput)
        }
    }
}

module.exports = tags;