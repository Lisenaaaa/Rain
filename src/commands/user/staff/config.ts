import { BotCommand } from '@extensions/BotCommand';
import commandManager from '@functions/commandManager';
import utils from '@functions/utils'

export default class config extends BotCommand {
    constructor() {
        super('config', {
            aliases: ['config'],
            description: 'This needs to be a slashcommand. It will break everything.',
            usage: '-config',
            discordPerms: ['MANAGE_GUILD'],

            slash: true,
            slashGuilds: utils.slashGuilds
        })
    }
    async exec(message, args) {
        if (!await commandManager.checkIfCommandCanBeUsed(message, this.id)) {
            return message.reply('<a:nonofast:862857752124194816> you arent cool enough to config')
        }
        
            message.reply('<a:yesyesfast:862857597111894026> this is config')
        
    }
}