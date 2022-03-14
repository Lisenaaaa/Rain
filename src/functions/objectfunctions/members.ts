import { Perms } from '../../types/misc'
import { GuildMember } from 'discord.js'
import { container } from '@sapphire/framework'

export class Members {
	public importantPerms(member: GuildMember) {
		const permsArray = member.permissions.toArray()
		const importantPerms = [
			'BanMembers',
			'KICK_MEMBERS',
			'MANAGE_CHANNELS',
			'MANAGE_GUILD',
			'VIEW_AUDIT_LOG',
			'PRIORITY_SPEAKER',
			'SEND_TTS_MESSAGES',
			'MENTION_EVERYONE',
			'MUTE_MEMBERS',
			'DEAFEN_MEMBERS',
			'MOVE_MEMBERS',
			'MANAGE_NICKNAMES',
			'MANAGE_WEBHOOKS',
			'MANAGE_EMOJIS_AND_STICKERS',
			'MANAGE_THREADS',
		]
		let finalArray = permsArray.filter((perm) => importantPerms.includes(perm))

		if (permsArray.includes('Administrator')) finalArray = ['Administrator']

		return finalArray
	}

	async hasPermission(member: GuildMember, perm: Perms): Promise<boolean> {
		let perms = 'none'
		let permsArray: Perms[] = []

		perms = await this.getPerms(member)

		if (perms === 'none') {
			return false
		}
		if (perms === 'trialHelper') {
			permsArray = ['none', 'trialHelper']
		}
		if (perms === 'helper') {
			permsArray = ['none', 'trialHelper', 'helper']
		}
		if (perms === 'moderator') {
			permsArray = ['none', 'trialHelper', 'helper', 'moderator']
		}
		if (perms === 'srMod') {
			permsArray = ['none', 'trialHelper', 'helper', 'moderator', 'srMod']
		}
		if (perms === 'admin') {
			permsArray = ['none', 'trialHelper', 'helper', 'moderator', 'srMod', 'admin']
		}
		if (perms === 'owner') {
			permsArray = ['none', 'trialHelper', 'helper', 'moderator', 'srMod', 'admin', 'owner']
		}

		return permsArray.includes(perm)
	}

	public isOwner(member: GuildMember) {
		if (member.guild.ownerId === member.id) return true
		else return false
	}

	async getPerms(member: GuildMember): Promise<Perms> {
		if (this.isOwner(member)) return 'owner'

		const db = await container.database.guilds.findByPk(member.guild.id)
		if (!db) {
			throw new Error(`Couldn't find the database for guild ${member.guild.id}`)
		}

		const roleSettings = {
			owner: db.ownerRole,
			admin: db.adminRole,
			srMod: db.srModRole,
			moderator: db.modRole,
			helper: db.helperRole,
			trialHelper: db.trialHelperRole,
		}

		for (const [id] of member.roles.cache) {
			for (const perm in roleSettings) {
				if (roleSettings[perm as keyof typeof roleSettings] === id) {
					return perm as Perms
				}
			}
		}

		return 'none'
	}

	async mute(member: GuildMember, time?: Date): Promise<boolean> {
		try {
			const muteRoleId = (await container.database.guilds.findByPk(member.guild.id))?.muteRole
			if (!muteRoleId) throw new Error("I can't mute people without having a role set to mute them with.")
			const muteRole = await member.guild.roles.fetch(muteRoleId)
			if (!muteRole) throw new Error("I can't mute people without having a role set to mute them with.")

			await member.roles.add(muteRole)
			// await container.users.editGuildEntry(member.user, member.guild.id, 'muted', { status: true, expires: time ? time : null })
			if (!(await container.database.members.findOne({ where: { memberId: member.id, guildId: member.guild.id } }))) {
				await container.database.members.create({ memberId: member.id, guildId: member.guild.id })
			}
			await container.database.members.update({ muteStatus: true, muteExpires: time ?? null }, { where: { memberId: member.id, guildId: member.guild.id } })
			return true
		} catch (err) {
			await container.utils.error(err, { type: 'muting a member', data: {} })
			return false
		}
	}

	async unmute(member: GuildMember) {
		try {
			const muteRoleId = (await container.database.guilds.findByPk(member.guild.id))?.muteRole
			if (!muteRoleId) throw new Error("I can't unmute people without having a role set to remove from them.")
			const muteRole = await member.guild.roles.fetch(muteRoleId)
			if (!muteRole) throw new Error("I can't unmute people without having a role set to remove from them.")
			await member.roles.remove(muteRole)
			await container.database.members.update({ muteStatus: false, muteExpires: null }, { where: { memberId: member.id, guildId: member.guild.id } })
			return true
		} catch (err) {
			await container.utils.error(err, { type: 'unmuting a member', data: {} })
			return false
		}
	}

	async isMuted(member: GuildMember): Promise<boolean> {
		return !!(await container.database.members.findOne({ where: { memberId: member.id, guildId: member.guild.id } }))?.muteStatus
	}

	hasRolePriority(member: GuildMember, otherMember: GuildMember) {
		if (!member.roles && !otherMember.roles) return false
		if (!member.roles && otherMember.roles) return false
		if (member.roles && !otherMember.roles) return true
		return member.roles.highest.position > otherMember.roles.highest.position
	}
}
