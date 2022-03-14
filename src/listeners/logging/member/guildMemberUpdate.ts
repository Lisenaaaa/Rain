import { Embed } from '@discordjs/builders'
import { ApplyOptions } from '@sapphire/decorators'
import { Listener, ListenerOptions } from '@sapphire/framework'
import { GuildMember } from 'discord.js'

@ApplyOptions<ListenerOptions>({
	once: false,
	event: 'guildMemberUpdate',
})
export class MemberUpdateListener extends Listener {
	async run(oldMember: GuildMember, newMember: GuildMember) {
		if (!(await this.container.database.guilds.findByPk(newMember.guild.id))) {
			await this.container.database.guilds.create({ id: newMember.guild.id })
		}

		const removedRoles = []
		const addedRoles = []
		let removedNick = false
		let hasNewNick = false

		if (oldMember.roles != newMember.roles) {
			for (const [id] of oldMember.roles.cache) {
				if (!newMember.roles.cache.has(id)) {
					removedRoles.push(id)
				}
			}
			for (const [id] of newMember.roles.cache) {
				if (!oldMember.roles.cache.has(id)) {
					addedRoles.push(id)
				}
			}
		}

		if (oldMember.nickname != newMember.nickname) {
			if (!newMember.nickname) {
				removedNick = true
			} else {
				hasNewNick = true
			}
		}

		await this.container.guilds.log(
			newMember.guild,
			'member',
			new Embed({
				title: newMember.user.tag,
				description: `
		${removedRoles.length != 0 ? `Removed roles: ${removedRoles.map((r) => `<@&${r}>`).join(', ')}` : ''}
		${addedRoles.length != 0 ? `\nAdded roles: ${addedRoles.map((r) => `<@&${r}>`).join(', ')}` : ''}
		${removedNick ? `\nNickname \`${oldMember.nickname}\` was removed.` : ''}
		${hasNewNick ? (oldMember.nickname ? `\nNickname changed from ${oldMember.nickname} to ${newMember.nickname}` : `Set their nickname to \`${newMember.nickname}\``) : ''}
		`,
				footer: { text: newMember.id },
				timestamp: `${this.container.utils.now('milliseconds')}`,
			})
		)
	}
}
