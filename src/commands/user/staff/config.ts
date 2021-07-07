import { BotCommand } from '@extensions/BotCommand';
import commandManager from '@functions/commandManager';
import utils from '@functions/utils'

export default class config extends BotCommand {
    constructor() {
        super('config', {
            aliases: ['config'],
            description: 'This needs to be a slashcommand. It will break everything.',
            usage:'-config',
            discordPerms:['MANAGE_SERVER'],

            slash:true,
            slashGuilds:utils.slashGuilds
        })
    }
    async exec(message, args) {
        if (!commandManager.checkIfCommandCanBeUsed(message, this.id)) { return }
        message.reply('hi')
    }
}