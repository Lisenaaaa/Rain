import { BotListener } from '@extensions/BotListener';
import commandManager from '@functions/commandManager';
import utils from '@functions/utils'

export default class miscErrorListener extends BotListener {
    constructor() {
        super('miscErrorListener', {
            emitter: 'process',
            event: 'unhandledRejection'
        })
    }
    async exec(error) {
        if (error == "TypeError: Cannot read property 'send' of undefined" && this.client.user == null) {
            console.log(`Invalid token, or other login error.`)
            process.exit()
        }

        if (error == "TypeError: Cannot read property 'send' of undefined" && this.client.user != null) {
            console.error(error)
        }

        this.client.error(error)
    }
}