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
        let bannedwords = [
            'i unironically use badlion client'
        ]
        let hasTriggered = false

        bannedwords.forEach(function (word) {
            if (message.content.toLowerCase().includes(word) && message.author.bot == false) {
                if (hasTriggered == false) {
                    
                    message.delete()
                    moderation.ban(message.member, `Automod | Banned Words`, message.author, message)

                    hasTriggered = true
                }
            }
        })
    }
}

module.exports = automodListener;