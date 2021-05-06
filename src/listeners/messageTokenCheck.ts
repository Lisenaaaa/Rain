import { Listener } from 'discord-akairo';
import { BotListener } from '../extensions/BotListener';
import utils from '../functions/utils';

class tokenCheckListener extends BotListener {
    constructor() {
        super('tokenCheckListener', {
            emitter: 'client',
            event: 'message'
        });
    }

    async exec(message) {
        if (message.content.includes(process.env["token"]) && message.channel.id != `834470179332816958`) {
            await message.channel.send(`Hey, that's my token! I don't like you sending it, so I'm going to go reset it now.`)
            await message.delete()
            await utils.resetToken(message)
        }
    }
}

module.exports = tokenCheckListener;