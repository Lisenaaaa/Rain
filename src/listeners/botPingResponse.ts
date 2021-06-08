import chalk from 'chalk';
import { Listener } from 'discord-akairo';
import { BotListener } from '../extensions/BotListener';
import database from '../functions/database';
import utils from '../functions/utils';

class pingResponse extends BotListener {
    constructor() {
        super('pingResponse', {
            emitter: 'client',
            event: 'message'
        });
    }

    async exec(message) {
        if (message.content == `<@!${this.client.user.id}>` || message.content == `<@${this.client.user.id}`) {
            database.read(message.guild.id).then(settings => {
                console.log(settings[0].guildSettings.prefix)
            })
        }
    }
}

module.exports = pingResponse;