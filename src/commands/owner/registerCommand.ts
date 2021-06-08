import { BotCommand } from '../../extensions/BotCommand';
import database from '../../functions/database';

export default class registerCommand extends BotCommand {
    constructor() {
        super('registerNewCommand', {
            aliases: ['registerCommand'],
        })
    }
    async exec(message, args) {
        const globalCommandsDB = await database.readCommandGlobal()

        console.log(globalCommandsDB)
    }
}