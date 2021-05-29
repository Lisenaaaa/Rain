import { BotCommand } from '../extensions/BotCommand';

export default class templateCommand extends BotCommand {
    constructor() {
        super('templateCommand', {
            aliases: ['templateCommand'],
        })
    }
    async exec(message, args) {
        //if statement to check if they can run the code

        //code
    }
}