import { Command } from 'discord-akairo';
import { MessageEmbed } from 'discord.js'
import utils from '../../../functions/utils';

export default class BeanCommand extends Command {

    constructor() {
        super('bean', {
            aliases: ['bean','fakeban','eatbeannow'],
            args: [
                {
                    id: 'member',
                    type: 'member'
                },
                {
                    id: 'reason',
                    type: 'string',
                    match: 'restContent'
                }
            ],
            channel: 'guild'
        });
    }

    async exec(message, args) {
        let reason
        if (args.reason.length > 900) {
            reason = utils.haste(args.reason)
        }
        else {
            reason = args.reason
        }

        const ErrorEmbed = new MessageEmbed()
            .setColor('#ff0000')
            .setTitle('Something went wrong!')

        if (!args.member) {
            ErrorEmbed.setDescription('No member found with that name.')
            return message.channel.send(ErrorEmbed)
        }

        if (args.member == 661018000736124948) {
            return message.channel.send('Hey, why did you try to bean me? I don\'t like that.')
        }

        const BanEmbed = new MessageEmbed()
            .setColor('#ff0000')
            .setTitle('A user has been permanently beaned.')
            .setAuthor(message.author.tag)
            .setTimestamp()
            .addFields(
                { name: 'Beaned User', value: args.member },
                { name: 'Bean Reason', value: reason }
            )

        message.channel.send(BanEmbed);
    }
}
