import { BotCommand } from '@extensions/BotCommand';
import commandManager from '@functions/commandManager';
import utils from '@functions/utils'

export default class templateCommand extends BotCommand {
    constructor() {
        super('templateCommand', {
            aliases: ['templateCommand'],
            description: {
                description: 'This is an example command!',
                usage: '-templateCommand',
                defaultPerms: 'none'
            }
        })
    }
    async exec(message, args) {
        if (!commandManager.checkIfCommandCanBeUsed(message, this.id)) { return }
        message.reply('hi')
    }
}