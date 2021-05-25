import chalk from 'chalk';
import { BotListener } from '../extensions/BotListener';
import database from '../functions/database';
import utils from '../functions/utils';

class tagsListener extends BotListener {
    constructor() {
        super('tagsListener', {
            emitter: 'client',
            event: 'message'
        });
    }

    async exec(message) {
        try {
            await database.read(message.guild.id).then(guildDB => {
                const tags = guildDB[0].tags
                tags.forEach(tag => {
                    if (message.content == `-tag ${tag.name}` && message.author.bot == false) { message.channel.send(tag.value) }
                })
            })
        }
        catch (err) {
            if (err == `TypeError: Cannot read property 'id' of null`) { return }
            else { utils.errorhandling(err, message) }
        }
    }
}


module.exports = tagsListener;