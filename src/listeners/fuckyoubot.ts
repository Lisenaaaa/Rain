import chalk from 'chalk';
import { Listener } from 'discord-akairo';
import { BotListener } from '../extensions/BotListener';

class fuckYouBot extends BotListener {
    constructor() {
        super('fuckYouBot', {
            emitter: 'client',
            event: 'message'
        });
    }

    exec(message) {
        const fuckYouBotTriggers = [
            {
                "trigger": "hentai",
                "response": "Give me the sauce",
                "type": "contains"
            },
            {
                "trigger": "fuck you",
                "response": "ok, when?",
                "type": "equals"
            },
            {
                "trigger": "fuck",
                "response": "fuck you",
                "type": "contains"
            },
            {
                "trigger": "zordtest",
                "userID": "545277690303741962",
                "response": "test worked",
                "type": "equals"
            }
        ]

        fuckYouBotTriggers.forEach(fuckYou => {
            if (fuckYou.userID && fuckYou.type == `equals` && message.content.toLowerCase().includes(fuckYou.trigger) && fuckYou.userID == message.author.id && message.author.bot == false && message.guild.id == `794610828317032458`) {
                message.channel.send(fuckYou.response)
            }
            if (!fuckYou.userID && fuckYou.type == `equals` && message.content.toLowerCase().includes(fuckYou.trigger) && message.author.bot == false && message.guild.id == `794610828317032458`) {
                message.channel.send(fuckYou.response)
            }
            if (!fuckYou.userID && fuckYou.type == `contains` && message.content.toLowerCase().includes(fuckYou.trigger) && message.author.bot == false && message.guild.id == `794610828317032458`) {
                message.channel.send(fuckYou.response)
            }
            if (fuckYou.userID && fuckYou.type == `contains` && message.content.toLowerCase().includes(fuckYou.trigger) && fuckYou.userID == message.author.id && message.author.bot == false && message.guild.id == `794610828317032458`) {
                message.channel.send(fuckYou.response)
            }
        })
    }
}

module.exports = fuckYouBot;