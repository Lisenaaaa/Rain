import { Listener } from 'discord-akairo';

class ReadyListener extends Listener {
    constructor() {
        super('h', {
            emitter: 'client',
            event: 'message'
        });
    }

    exec(message) {
        if (message.content.toLowerCase().includes(`fuck`) && message.author.bot == false && message.guild.id == `794610828317032458`) {
            message.channel.send(`fuck you`)
        }
        if (message.content == `<@!661018000736124948>` && message.author.bot == false) {
            message.channel.send(`hello yes my prefix is \`-\``)
        }
    }
}

module.exports = ReadyListener;