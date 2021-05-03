import { Listener } from 'discord-akairo';

class tags extends Listener {
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