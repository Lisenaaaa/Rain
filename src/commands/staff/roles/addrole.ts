import { Command } from 'discord-akairo';
import { MessageEmbed } from 'discord.js';
import utils from '../../../functions/utils';

export default class addrole extends Command {
    constructor() {
        super('addrole', {
            aliases: ['addrole', 'role', 'arole', 'ar'],
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
            if (message.member.roles.highest.rawPosition < args.role.rawPosition) {
                await message.channel.send(`Your highest role is lower than or equal to ${args.role.name}, so you cannot give it to anyone!`)

            }
            else if (message.member.user.id == message.guild.ownerID) {
                await args.member.roles.add(args.role)

                const roleembed = new MessageEmbed()
                    .setDescription(`Added <@&${args.role.id}> to **${args.member.user}**`)

                await message.channel.send(roleembed)
            }
            else {
                await args.member.roles.add(args.role)

                const roleembed = new MessageEmbed()
                    .setDescription(`Added <@&${args.role.id}> to **${args.member.user}**`)

                await message.channel.send(roleembed)
            }
        }
        catch (err) {
            await utils.errorhandling(err, message)
        }
    }
}
