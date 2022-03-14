import { Embed } from '@discordjs/builders'
import { ApplyOptions } from '@sapphire/decorators'
import { Listener, ListenerOptions } from '@sapphire/framework'
import { MemberUnmuteData } from '../../../../commands/staff/moderation/unmute'

@ApplyOptions<ListenerOptions>({
	once: false,
	event: 'memberUnmuted',
})
export class MemberUnmutedListener extends Listener {
	async run(mute: MemberUnmuteData) {
		const embed = new Embed({
			title: 'Member Unmuted',
			fields: [
				{ name: 'User', value: `${mute.member.user.tag} (\`${mute.member.id}\`)` },
				{ name: 'Moderator', value: `${mute.moderator.user.tag} (\`${mute.moderator.user.id}\`)` },
				{ name: 'Reason', value: mute.reason ?? 'No reason given.', inline: true },
				{ name: 'Modlog ID', value: `\`${mute.id}\``, inline: true },
			],
			timestamp: `${this.container.utils.now('milliseconds')}`,
		})

		await this.container.guilds.log(mute.moderator.guild, 'moderation', embed)
	}
}
