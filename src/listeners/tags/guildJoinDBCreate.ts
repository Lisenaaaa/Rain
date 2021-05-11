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
        //console.log(`Joined ${guild.name}!`)
        database.add(guild.id).then(e => {
            if (e.result.ok == 1) {
                console.log(`Database entry succesfully added!`)
            }
        })
    }
}

module.exports = guildJoinDBCreate;