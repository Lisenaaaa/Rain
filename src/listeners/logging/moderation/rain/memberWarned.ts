import { ApplyOptions } from '@sapphire/decorators'
import { Listener, ListenerOptions } from '@sapphire/framework'
import { MessageEmbed } from 'discord.js'
import { MemberWarnData } from '../../../../commands/staff/moderation/warn'

@ApplyOptions<ListenerOptions>({
	once: false,
	event: 'memberWarned',
})
export class MemberWarnedListener extends Listener {
	async run(warn: MemberWarnData) {
		const embed = new MessageEmbed({
			title: 'Member Warned',
			fields: [
				{ name: 'User', value: `${warn.member.user.tag} (\`${warn.member.id}\`)` },
				{ name: 'Moderator', value: `${warn.moderator.user.tag} (\`${warn.moderator.user.id}\`)` },
				{ name: 'Reason', value: warn.reason, inline: true },
				{ name: 'Modlog ID', value: `\`${warn.id}\``, inline: true },
			],
			timestamp: this.container.utils.now('milliseconds'),
		})

		await this.container.guilds.log(warn.moderator.guild, 'moderation', embed)
	}
}
