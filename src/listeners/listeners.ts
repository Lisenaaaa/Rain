import { Listener } from 'discord-akairo';
import { BotListener } from '../extensions/BotListener';

class ReadyListener extends BotListener {
    constructor() {
        super('ready', {
            emitter: 'client',
            event: 'ready'
        });
    }

    exec() {
        console.log(`Bot online!`)
        console.log(`\n`)
        console.log(`---Bot Output---`)

        this.client.user.setActivity('Among Us burn', { type: 'WATCHING' })
    }
}

module.exports = ReadyListener;