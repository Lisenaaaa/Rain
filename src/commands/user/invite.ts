import { MessageEmbed } from 'discord.js';
import { BotCommand } from '@extensions/BotCommand';

export default class invite extends BotCommand {
    constructor() {
        super('invite', {
            aliases: ['invite'],
            description: 'Shows the link to invite me to your server!',
            usage: '-invite',
            discordPerms: ['SEND_MESSAGES']
        })
    }
    async exec(message) {
        const inviteLink = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'

        const inviteEmbed = new MessageEmbed()
            .setTitle('Invite Me')
            .setDescription(`[Click here to invite me to your server!](${inviteLink})`)
            .setColor(message.member.roles.highest.color)

        message.channel.send(inviteEmbed)
    }
}