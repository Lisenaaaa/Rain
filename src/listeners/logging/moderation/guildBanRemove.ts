import { Embed } from '@discordjs/builders'
import { ApplyOptions } from '@sapphire/decorators'
import { Listener, ListenerOptions } from '@sapphire/framework'
import { GuildBan } from 'discord.js'

@ApplyOptions<ListenerOptions>({
	once: false,
	event: 'guildBanRemove',
})
export class GuildBanRemoveListener extends Listener {
	async run(ban: GuildBan) {
		const embed = new Embed({
			title: 'Guild Member Unbanned',
			fields: [
				{ name: 'User', value: `${ban.user.tag} (\`${ban.user.id}\`)` },
				{ name: 'Reason', value: ban.reason ?? 'No reason given.' },
			],
			timestamp: `${this.container.utils.now('milliseconds')}`,
		})

		await this.container.guilds.log(ban.guild, 'moderation', embed)
	}
}
