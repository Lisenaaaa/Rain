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
        if (message.content.toLowerCase().includes(`owo`) && message.guild.id == `794610828317032458`) {
            message.delete()
        }
        if (message.content.toLowerCase().includes(`uwu`) && message.guild.id == `794610828317032458`) {
            message.delete()
        }
        if (message.author.id == '400778129217421335' && message.guild.id == `794610828317032458`) {
            message.delete()
        }
    }
}

module.exports = fuckyoubot;