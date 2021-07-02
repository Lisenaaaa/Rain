import { BotCommand } from '../extensions/BotCommand';
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
        //if statement to check if they can run the code

        //code
    }
}