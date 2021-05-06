import { Listener } from 'discord-akairo';
import { BotListener } from '../../extensions/BotListener';

class fuckyoubot extends BotListener {
    constructor() {
        super('fuckyoubot', {
            emitter: 'client',
            event: 'message'
        });
    }

    async exec(message) {
        //fuck you bot
        if (message.content.toLowerCase().includes(`fuck`) && message.author.bot == false && message.guild.id == `794610828317032458`) {
            message.channel.send(`fuck you, ${message.author.username}`)
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
        
        //OH MY GOD WHAT IS IT WITH THE DOUGLAS SPAM
        if (message.content.toLowerCase().includes(`douglas`) && message.guild.id == `794610828317032458`) {
            message.delete()
        }

        //i dislike anime
        if (message.content.toLowerCase().includes(`anime`) && message.guild.id == `794610828317032458`) {
            message.channel.send(`Anime is cringe!`)
        }

        //bazinga
        // if (message.author.id == '560922946797830154' && message.guild.id == `794610828317032458`) {
        //     message.channel.send(`bazinga`)
        // }

        //yuo're
        // if (message.author.id == '476472103315570700' && message.guild.id == `794610828317032458`) {
        //     message.channel.send(`You're message will be deleted in three minutes.`)
        // }

        //i mean i would put his real name in the code but i dont want to because i dont want to doxx him
        // if (message.author.id == `746844211134857317` && message.guild.id == `794610828317032458`) {
        //     message.channel.send(`ok ${process.env["bahama"]}`)
        // }
    }
}

module.exports = fuckyoubot;