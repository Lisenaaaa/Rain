import { MessageEmbed } from 'discord.js';
import { BotCommand } from '../../extensions/BotCommand';
import utils from '../../functions/utils';

export default class quote extends BotCommand {
    constructor() {
        super('quote', {
            aliases: ['quote'],
            args: [
                {
                    id: 'messageID',
                    type: 'message'
                },
            ],
            channel: 'guild'
        });
    }

    async exec(message, args) {
        try {
            const quoteEmbed = new MessageEmbed()
                .setAuthor(args.messageID.author.tag)
                .addField(`Content`, args.messageID.content)

            message.channel.send(quoteEmbed)
        }
        catch (err) {
            utils.errorhandling(err, message)
        }
    }
}
