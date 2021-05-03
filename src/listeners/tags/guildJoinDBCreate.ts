import { Listener } from 'discord-akairo';

class guildJoinDBCreate extends Listener {
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