import { ApplyOptions } from '@sapphire/decorators'
import { Listener, ListenerOptions } from '@sapphire/framework'
import { MessageEmbed } from 'discord.js'
import { MemberBanData } from '../../../../commands/staff/moderation/ban'

@ApplyOptions<ListenerOptions>({
    once: false,
    event: 'memberBanned',
})
export class MemberBannedListener extends Listener {
    async run(ban: MemberBanData) {
        const embed = new MessageEmbed({
            title: 'Member Banned',
            fields: [
                { name: 'User', value: `${ban.member.tag} (\`${ban.member.id}\`)` },
                { name: 'Moderator', value: `${ban.moderator.user.tag} (\`${ban.moderator.user.id}\`)` },
                { name: 'Reason', value: ban.reason ?? 'No reason given.', inline: true },
                { name: 'Modlog ID', value: `\`${ban.id}\``, inline: true },
            ],
            timestamp: `${this.container.utils.now('milliseconds')}`,
        })

        if (ban.time) {
            embed.addFields({ name: 'Expires', value: `<t:${Math.floor(ban.time.getTime() / 1000)}:F>` })
        }

        await this.container.guilds.log(ban.guild, 'moderation', embed)
    }
}
