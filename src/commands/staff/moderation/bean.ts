import { Command } from 'discord-akairo';
import { MessageEmbed } from 'discord.js'

export default class BeanCommand extends Command {

    constructor() {
        super('bean', {
            aliases: ['bean'],
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

        //cant ban zordlan
        /*if (args.member == 492488074442309642) {
            return message.channel.send('no.')
        }*/

        //cant ban nacrt
        /*if (args.member == 435443705055543306) {
            return message.channel.send('no.')
        }*/

        const BanEmbed = new MessageEmbed()
            .setColor('#ff0000')
            .setTitle('A user has been permanently beaned.')
            .setAuthor(message.author.tag)
            .setTimestamp()
            .addFields(
                { name: 'Beaned User', value: args.member },
                { name: 'Bean Reason', value: args.reason }
            )

        let ErrorEmbedPingAAA = args.member.tag

        /*args.member.send("You have been banned from " + message.guild.name + " for " + args.reason)
            .then(() => args.member.ban({ reason: message.author.tag + " | " + args.reason }))
            .catch(() => {
                ErrorEmbed.setDescription(`I couldn\'t DM ${ErrorEmbedPingAAA}.`)
                message.channel.send(ErrorEmbed)

                args.member.ban({ reason: message.author.tag + " | " + args.reason })
            })*/
        message.channel.send(BanEmbed);
    }
}
