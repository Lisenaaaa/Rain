import { ApplyOptions } from '@sapphire/decorators'
import { Listener, ListenerOptions } from '@sapphire/framework'
import { GuildBan, MessageEmbed } from 'discord.js'

@ApplyOptions<ListenerOptions>({
    once: false,
    event: 'guildBanAdd',
})
export class GuildBanAddListener extends Listener {
    async run(ban: GuildBan) {
        const embed = new MessageEmbed({
            title: 'Guild Member Banned',
            fields: [
                { name: 'User', value: `${ban.user.tag} (\`${ban.user.id}\`)` },
                { name: 'Reason', value: ban.reason ?? 'No reason given.' },
            ],
            timestamp: `${this.container.utils.now('milliseconds')}`,
        })

        await this.container.guilds.log(ban.guild, 'moderation', embed)
    }
}
