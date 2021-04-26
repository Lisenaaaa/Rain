import { Listener } from 'discord-akairo';

class ReadyListener extends Listener {
    constructor() {
        super('h', {
            emitter: 'client',
            event: 'message'
        });
    }

    exec(message) {
        if (message.content.toLowerCase().includes(`fuck`) && message.author.id != `661018000736124948` && message.guild.id == `794610828317032458`) {
            message.channel.send(`fuck you`)
        }
    }
}

module.exports = ReadyListener;