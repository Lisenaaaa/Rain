import { BotCommand } from '@extensions/BotCommand';
import { BotListener } from '@extensions/BotListener';
import { Message } from 'discord.js';

export default class commandErrorListener extends BotListener {
    constructor() {
        super('commandErrorListener', {
            emitter: 'commandHandler',
            event: 'error'
        })
    }
    async exec(error:any, message:Message, command: BotCommand) {
        if (this.client.ownerID.includes(message.author.id)) { message.reply(`An error occured!\n\`\`\`js\n${error.stack}\`\`\``) }
        else { message.reply({ embeds: [this.client.utils.error(error, ' command', message)] }) }
    }
}