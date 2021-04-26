import { Listener } from 'discord-akairo';

class pingresponse extends Listener {
    constructor() {
        super('pingresponse', {
            emitter: 'client',
            event: 'message'
        });
    }

    exec(message) {
        if (message.content == `<@!661018000736124948>` && message.author.bot == false) {
            message.channel.send(`hello yes my prefix is \`-\``)
        }
    }
}

module.exports = pingresponse;