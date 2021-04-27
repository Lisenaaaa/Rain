import { Listener } from 'discord-akairo';

class f extends Listener {
    constructor() {
        super('f', {
            emitter: 'client',
            event: 'message'
        });
    }

    async exec(message) {
        //yes i stole the idea from optibot
        //no, i have no idea what optibot is coded in, i didnt steal the code
        try {
            if (message.content.toLowerCase() == `f`) {
                message.react(`🇫`)
            }
        }
        catch (err) {
            return
        }
    }
}

module.exports = f;