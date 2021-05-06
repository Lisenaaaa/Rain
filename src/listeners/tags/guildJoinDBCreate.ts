import { Listener } from 'discord-akairo';
import { BotListener } from '../../extensions/BotListener';

class guildJoinDBCreate extends BotListener {
    constructor() {
        super('guildJoinDBCreate', {
            emitter: 'client',
            event: 'guildCreate'
        });
    }

    exec(guild) {
        
    }
}

module.exports = guildJoinDBCreate;