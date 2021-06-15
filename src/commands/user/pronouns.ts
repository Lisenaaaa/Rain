import language from "../../constants/language";
import { BotCommand } from '../../extensions/BotCommand';
import utils from "../../functions/utils";

export default class pronouns extends BotCommand {
    constructor() {
        super('pronouns', {
            aliases: ['pronouns'],
            args: [{ id: `person`, type: `user`, default: message => message.author }],
            description: {
                'description': 'Shows the pronouns of a user, if they have them set on https://pronoundb.org',
                'usage': '-pronouns <user>'
            }
        })
    }
    async exec(message, args) {
        const pronouns = await utils.getPronouns(args.person, `details`)
        message.util.send(await language.pronounsSet(args.person, message.author, pronouns))
    }
}