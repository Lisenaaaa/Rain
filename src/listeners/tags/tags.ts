import { MessageEmbed } from 'discord.js';
import { BotListener } from '../../extensions/BotListener';
import db from '../../functions/database';

class tags extends BotListener {
    constructor() {
        super('tags', {
            emitter: 'client',
            event: 'message'
        });
    }

    async exec(message) {
        if (message.guild) {
            await db.read(message.guild.id).then(data => {
                data[0].tags.forEach(tag => {
                    if (message.content == `-tag ${tag.name}` && message.author.bot == false) {
                        message.channel.send(tag.value)
                    }
                })
            })
        }
    }
}

module.exports = tags;