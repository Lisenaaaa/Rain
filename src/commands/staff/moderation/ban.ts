import { Command } from 'discord-akairo';
import { MessageEmbed } from 'discord.js'

export default class BanCommand extends Command {

    constructor() {
        super('ban', {
            aliases: ['ban', 'leaveservernow', 'banish', 'byebye'],
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
            clientPermissions: ['BAN_MEMBERS', 'EMBED_LINKS'],
            userPermissions: ['BAN_MEMBERS'],
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

        if (args.member == message.author.id) {
            ErrorEmbed.setDescription('Sorry, you can\'t ban yourself!')
            return message.channel.send(ErrorEmbed)

        }

        if (args.member == message.guild.ownerID) {
            ErrorEmbed.setDescription('Sorry, you can\'t ban the owner of the server!')
            return message.channel.send(ErrorEmbed)
        }

        if (args.member == 661018000736124948) {
            return message.channel.send('Hey, why did you try to ban me? I don\'t like that.')
        }

        //cant ban zordlan
        /*if (args.member == 492488074442309642) {
            return message.channel.send('no.')
        }*/

        //cant ban nacrt
        /*if (args.member == 435443705055543306) {
            return message.channel.send('no.')
        }*/

        if (args.member.bannable != true) {
            ErrorEmbed.setDescription('I can\'t ban that user. Most likely my highest role is under their highest role.')
            return message.channel.send(ErrorEmbed)
        }

        const BanEmbed = new MessageEmbed()
            .setColor('#ff0000')
            .setTitle('A user has been permanently banned.')
            .setAuthor(message.author.tag)
            .setTimestamp()
            .addFields(
                { name: 'Banned User', value: args.member },
                { name: 'Ban Reason', value: args.reason }
            )

        let ErrorEmbedPingAAA = args.member.tag

        args.member.send("You have been banned from " + message.guild.name + " for " + args.reason)
            .then(() => args.member.ban({ reason: message.author.tag + " | " + args.reason }))
            .catch(() => {
                ErrorEmbed.setDescription(`I couldn\'t DM ${ErrorEmbedPingAAA}.`)
                message.channel.send(ErrorEmbed)

                args.member.ban({ reason: message.author.tag + " | " + args.reason })
            })
        message.channel.send(BanEmbed);
    }
}
