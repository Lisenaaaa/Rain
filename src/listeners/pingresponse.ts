import { Listener } from 'discord-akairo';
import { BotListener } from '../extensions/BotListener';

class misclisteners extends BotListener {
    constructor() {
        super('misclisteners', {
            emitter: 'client',
            event: 'message'
        });
    }

    exec(message) {
        if (message.content == `<@!661018000736124948>` && message.author.bot == false) {
            message.channel.send(`hello yes my prefix is \`-\` or you can ping me instead of that`)
        }

        if (message.content.toLowerCase().includes(`good bot`)) {
            message.channel.send(`<:happy:836647826489999372>`)
        }

        if (message.content.toLowerCase().includes(`bad bot`)) {
            message.channel.send(`<:wahhh:830508405331853373>`)
        }
    }
}

module.exports = misclisteners;