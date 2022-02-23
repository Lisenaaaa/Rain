import { ApplyOptions } from '@sapphire/decorators'
import { Listener, ListenerOptions } from '@sapphire/framework'
import { MessageEmbed } from 'discord.js'
import { MemberMuteData } from '../../../../commands/staff/moderation/mute'

@ApplyOptions<ListenerOptions>({
	once: false,
	event: 'memberMuted',
})
export class MemberMutedListener extends Listener {
	async run(mute: MemberMuteData) {
		const embed = new MessageEmbed({
			title: 'Member Muted',
			fields: [
				{ name: 'User', value: `${mute.member.user.tag} (\`${mute.member.user.id}\`)` },
				{ name: 'Moderator', value: `${mute.moderator.user.tag} (\`${mute.moderator.user.id}\`)` },
				{ name: 'Reason', value: mute.reason ?? 'No reason given.', inline: true },
				{ name: 'Modlog ID', value: `\`${mute.id}\``, inline: true },
			],
			timestamp: this.container.utils.now('milliseconds'),
		})

		if (mute.time) {
			embed.addField('Expires', `<t:${Math.floor(mute.time.getTime() / 1000)}:F>`)
		}

		await this.container.guilds.log(mute.member.guild, 'moderation', embed)
	}
}
