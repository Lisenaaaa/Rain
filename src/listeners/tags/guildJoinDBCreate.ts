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
        let dbconsole
        database.add(guild.id).then(e => {
            if (e) {
                if (e.result.ok == 1) {
                    dbconsole = `Database entry succesfully added!`
                }
            }
            else {
                dbconsole = `Guild already in DB, so entry was not created.`
            }

            utils.console(`Joined **${guild.name}**\n${dbconsole}`, this.client)
        })
    }
}

module.exports = guildJoinDBCreate;