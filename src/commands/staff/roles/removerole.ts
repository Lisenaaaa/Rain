import { Command } from 'discord-akairo';
import { MessageEmbed } from 'discord.js';
import utils from '../../../functions/utils';

export default class removerole extends Command {
    constructor() {
        super('removerole', {
            aliases: ['removerole', 'rrole', 'rr'],
            args: [
                {
                    id: 'member',
                    type: 'member'
                },
                {
                    id: 'role',
                    type: 'role'
                }
            ],
            clientPermissions: ['MANAGE_ROLES', 'EMBED_LINKS'],
            userPermissions: ['MANAGE_ROLES'],
            channel: 'guild'
        });
    }

    async exec(message, args) {
        try {
            if (message.member.roles.highest.position >> args.role.position) {
                await args.member.roles.remove(args.role)

                const roleembed = new MessageEmbed()
                    .setDescription(`Removed <@&${args.role.id}> from **${args.member.user}**`)

                await message.channel.send(roleembed)
            }
            // else if (message.author.id == message.guild.ownerID) {
            //     await args.member.roles.remove(args.role)

            //     const roleembed = new MessageEmbed()
            //         .setDescription(`Removed <@&${args.role.id}> from **${args.member.user}**`)

            //     await message.channel.send(roleembed)
            // }
            else {
                await message.channel.send(`Your highest role is under the role you're trying to give, so you cannot give it.`)
            }
        }
        catch (err) {
            await utils.errorhandling(err, message)
        }
    }
}
