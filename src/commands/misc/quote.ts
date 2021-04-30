import { Command } from 'discord-akairo';
import { MessageEmbed } from 'discord.js';
import { Message } from 'discord.js';
import utils from '../../functions/utils';

export default class quote extends Command {
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
                .setTitle(args.messageID.author.tag)
                .addField(`Content`, args.messageID.content)

            message.channel.send(quoteEmbed)
        }
        catch (err) {
            utils.errorhandling(err, message)
        }
    }
}
