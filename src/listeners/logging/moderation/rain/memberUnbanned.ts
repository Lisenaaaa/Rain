import { ApplyOptions } from '@sapphire/decorators'
import { Listener, ListenerOptions } from '@sapphire/framework'
import { MessageEmbed } from 'discord.js'
import { MemberUnbanData } from '../../../../commands/staff/moderation/unban'

@ApplyOptions<ListenerOptions>({
    once: false,
    event: 'memberUnbanned',
})
export class MemberUnbannedListener extends Listener {
    async run(ban: MemberUnbanData) {
        const embed = new MessageEmbed({
            title: 'Member Unbanned',
            fields: [
                { name: 'User', value: `${ban.member.tag} (\`${ban.member.id}\`)` },
                { name: 'Moderator', value: `${ban.moderator.user.tag} (\`${ban.moderator.user.id}\`)` },
                { name: 'Reason', value: ban.reason ?? 'No reason given.', inline: true },
                { name: 'Modlog ID', value: `\`${ban.id}\``, inline: true },
            ],
            timestamp: `${this.container.utils.now('milliseconds')}`,
        })

        await this.container.guilds.log(ban.moderator.guild, 'moderation', embed)
    }
}
