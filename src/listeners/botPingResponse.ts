import { BotListener } from '@extensions/BotListener';
import database from '@functions/database';
import { Message } from 'discord.js';

class pingResponse extends BotListener {
    constructor() {
        super('pingResponse', {
            emitter: 'client',
            event: 'messageCreate'
        });
    }

    async exec(message:Message) {
        if (message.content == `<@!${this.client.user!.id}>` || message.content == `<@${this.client.user!.id}`) {
            database.readGuild(message.guild!.id).then(settings => {
                const prefixes = (settings[0].guildSettings.prefix)
                let prefixString = new String

                prefixes.forEach((prefix:any) => {
                    prefixString = prefixString + `\`${prefix}\`, `
                })
                message.channel.send('hi yes my prefix' + (prefixes.length != 1 ? 'es here are' : ' here is') + `  ${prefixString} or just ping me`)
            })
        }
    }
}

module.exports = pingResponse;