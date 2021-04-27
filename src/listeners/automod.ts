import { Listener } from 'discord-akairo';
import moderation from '../functions/moderation';

class automodListener extends Listener {
    constructor() {
        super('automod', {
            emitter: 'client',
            event: 'message'
        });
    }

    exec(message) {
        if (message.content.toLowerCase().includes(`eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee`)) {
            message.delete()
            moderation.ban(message.member, `Automod | Banned Words`, message.author, message)
        }
    }
}

module.exports = automodListener;