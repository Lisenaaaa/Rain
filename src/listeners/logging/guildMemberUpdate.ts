import { ApplyOptions } from '@sapphire/decorators'
import { Listener, ListenerOptions } from '@sapphire/framework'
import { GuildMember, MessageEmbed } from 'discord.js'

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
			new MessageEmbed({
				title: newMember.user.tag,
				description: `
		${removedRoles.length != 0 ? `Roles removed: ${removedRoles.map((r) => `<@&${r}>`).join(', ')}\n` : ''}
		${addedRoles.length != 0 ? `Roles added: ${addedRoles.map((r) => `<@&${r}>`).join(', ')}\n` : ''}
		${removedNick ? `Nickname \`${oldMember.nickname}\` was removed.\n` : ''}
		${hasNewNick ? (oldMember.nickname ? `Nickname changed from ${oldMember.nickname} to ${newMember.nickname}` : `Set their nickname to \`${newMember.nickname}\``) : ''}
		`,
				footer: { text: newMember.id },
			})
		)
	}
}
