import { BotCommand } from '@extensions/BotCommand';
import commandManager from '@functions/commandManager';
import utils from '@functions/utils'
import { Message } from 'discord.js';

export default class templateCommand extends BotCommand {
    constructor() {
        super('templateCommand', {
            aliases: ['templateCommand'],
            description: 'This is an example command!',
            usage: '-templateCommand',
            discordPerms: ['SEND_MESSAGES'] //THIS NEEDS TO BE AN ACTUAL PERMISSION NOW

        })
    }
    async exec(message:Message, args:any) {
        if (!await commandManager.checkIfCommandCanBeUsed(message, this.id)) { return }
        message.reply('hi')
    }
}