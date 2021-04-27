import { Listener } from 'discord-akairo';

class fuckyoubot extends Listener {
    constructor() {
        super('fuckyoubot', {
            emitter: 'client',
            event: 'message'
        });
    }

    async exec(message) {
        //fuck you bot
        if (message.content.toLowerCase().includes(`fuck`) && message.author.bot == false && message.guild.id == `794610828317032458`) {
            message.channel.send(`fuck you`)
        }

        //you can probably tell what this does
        if (message.content.toLowerCase().includes(`owo`) && message.guild.id == `794610828317032458`) {
            message.delete()
            message.channel.send(`${message.author}, I don't think so!`)
        }

        if (message.content.toLowerCase().includes(`uwu`) && message.guild.id == `794610828317032458`) {
            message.delete()
            message.channel.send(`${message.author}, I don't think so!`)
        }

        //bubble cannot speak
        // if (message.author.id == '400778129217421335' && message.guild.id == `794610828317032458`) {
        //     //await bubbleuser.send(message.content)
        //     try {
        //         message.author.send(message.content)
        //     }
        //     catch (err) {
        //         return
        //     }
        //     message.delete()
        // }

        //bazinga
        if (message.author.id == '560922946797830154' && message.guild.id == `794610828317032458`) {
            message.channel.send(`bazinga`)
        }

    }
}

module.exports = fuckyoubot;