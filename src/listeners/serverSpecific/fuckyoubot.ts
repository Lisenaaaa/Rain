import { Listener } from 'discord-akairo';

class fuckyoubot extends Listener {
    constructor() {
        super('fuckyoubot', {
            emitter: 'client',
            event: 'message'
        });
    }

    exec(message) {
        if (message.content.toLowerCase().includes(`fuck`) && message.author.bot == false && message.guild.id == `794610828317032458`) {
            message.channel.send(`fuck you`)
        }
    }
}

module.exports = fuckyoubot;