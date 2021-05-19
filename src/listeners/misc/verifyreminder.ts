import { Listener } from 'discord-akairo';
import { TextChannel } from 'discord.js';
import { BotListener } from '../../extensions/BotListener';

class verifyReminder extends BotListener {
    constructor() {
        super('verifyReminder', {
            emitter: 'client',
            event: 'guildCreate'
        });
    }

    exec() {
        const channel = this.client.channels.cache.get(`794610828317032460`) as TextChannel

        if (this.client.guilds.cache.size >= 75) {
            channel.send(`<@492488074442309642> I've hit 75 guilds, which means that I can now be verified!`)
            console.log(`I just hit 75 guilds, which means I can be verified!`)
        }
    }
}

module.exports = verifyReminder;