import { BotListener } from '@extensions/BotListener';
import commandManager from '@functions/commandManager';
import utils from '@functions/utils'

export default class commandErrorListener extends BotListener {
    constructor() {
        super('commandErrorListener', {
            emitter: 'commandHandler',
            event: 'error'
        })
    }
    async exec(error, message) {
        if (this.client.ownerID.includes(message.author.id)) { message.reply(`An error occured!\n\`\`\`js\n${error.stack}\`\`\``) }
        else { message.reply({ embeds: [this.client.error(error, ' command')] }) }
    }
}