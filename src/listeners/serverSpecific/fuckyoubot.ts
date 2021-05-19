import { Listener } from 'discord-akairo';
import { MessageEmbed } from 'discord.js';
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
        if (message.content.toLowerCase().includes(`anime`) && message.author.bot == false && message.guild.id == `794610828317032458`) {
            message.channel.send(`Anime is cringe!`)
        }
        
        //fuck among us
        if (message.content.toLowerCase().includes(`sus`) && message.guild.id == `794610828317032458`) {
            message.delete()
            message.channel.send(`Among Us was ruined by the community, and is extremely unfunny.`)
        }

        //this has to be part of the fuckyoubot
        if (message.content.toLowerCase() == `fuck you` && message.guild.id == `794610828317032458`) {
            message.channel.send(`<@${message.author.id}> sure, when?`)
        }

        //fuck you, eval command
        if (message.content.toLowerCase() == `-serverdown` && message.author.id == `545277690303741962` && message.guild.id == `794610828317032458`) {
            let downEmbed = new MessageEmbed()
            downEmbed.setTitle(`Server connection errors, and what they mean`)
            downEmbed.addField(`Failed to log in: The authentication servers are currently down for maintenance`, `If you can connect to other servers, the auth servers are fine. This just means that for whatever reason, the server can't connect to them. In Zordlan's case, her internet is probably off.`)
            downEmbed.addField(`io.netty.channel.AbstractChannel$AnnotatedConnectException: syscall:getsockpot(...) failed: Connection refused:`, `The server is just down.`)

            message.channel.send(downEmbed)
        }

        //TAKO IM SORRY, LOGI WANTED THIS
        // if (message.author == `685141684534771796` && message.guild.id == `794610828317032458`) {
        //     message.channel.send(``)
        // }

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