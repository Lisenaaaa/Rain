import { Listener } from 'discord-akairo';

class tagslistener extends Listener {
    constructor() {
        super('tags', {
            emitter: 'client',
            event: 'guildCreate'
        });
    }

    exec(guild) {
        //do something here when i actually figure out how to make files
    }
}

module.exports = tagslistener;