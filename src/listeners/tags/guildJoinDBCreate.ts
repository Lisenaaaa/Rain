import { Listener } from 'discord-akairo';
import { BotListener } from '../../extensions/BotListener';
import database from '../../functions/database';
import utils from '../../functions/utils';

class guildJoinDBCreate extends BotListener {
    constructor() {
        super('guildJoinDBCreate', {
            emitter: 'client',
            event: 'guildCreate'
        });
    }

    async exec(guild) {
        utils.console(`Joined **${guild.name}**`, this.client)
        database.add(guild.id).then(e => {
            if (e.result.ok == 1) {
                utils.console(`Database entry succesfully added!`, this.client)
            }
        })
    }
}

module.exports = guildJoinDBCreate;