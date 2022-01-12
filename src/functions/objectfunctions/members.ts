import { perms } from '../../types/misc'
import { GuildMember } from 'discord.js'
import { container } from '@sapphire/framework'

export class Members {
	public importantPerms(member: GuildMember) {
		const permsArray = member.permissions.toArray()
		const importantPerms = [
			'BAN_MEMBERS',
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

		if (permsArray.includes('ADMINISTRATOR')) finalArray = ['ADMINISTRATOR']

		return finalArray
	}

	async hasPermission(member: GuildMember, perm: perms): Promise<boolean> {
		if (member.user.id === member.guild.ownerId) return true

		const roleSettings = container.cache.guilds.get(member.guild.id)?.guildSettings.staffRoles

		let found = false
		let perms = null
		let permsArray: perms[] = []

		const owner = roleSettings?.owner
		const admin = roleSettings?.admin
		const srMod = roleSettings?.srMod
		const moderator = roleSettings?.moderator
		const helper = roleSettings?.helper
		const trialHelper = roleSettings?.trialHelper

		member.roles.cache.forEach((role) => {
			if (role.id == owner && found == false) {
				found = true
				return (perms = 'owner')
			} else if (role.id == admin && found == false) {
				found = true
				return (perms = 'admin')
			} else if (role.id == srMod && found == false) {
				found = true
				return (perms = 'srMod')
			} else if (role.id == moderator && found == false) {
				found = true
				return (perms = 'moderator')
			} else if (role.id == helper && found == false) {
				found = true
				return (perms = 'helper')
			} else if (role.id == trialHelper && found == false) {
				found = true
				return (perms = 'trialHelper')
			}
		})

		if (perms == null) {
			return false
		}
		if (perms == 'trialHelper') {
			permsArray = ['none', 'trialHelper']
		}
		if (perms == 'helper') {
			permsArray = ['none', 'trialHelper', 'helper']
		}
		if (perms == 'moderator') {
			permsArray = ['none', 'trialHelper', 'helper', 'moderator']
		}
		if (perms == 'srMod') {
			permsArray = ['none', 'trialHelper', 'helper', 'moderator', 'srMod']
		}
		if (perms == 'admin') {
			permsArray = ['none', 'trialHelper', 'helper', 'moderator', 'srMod', 'admin']
		}
		if (perms == 'owner') {
			permsArray = ['none', 'trialHelper', 'helper', 'moderator', 'srMod', 'admin', 'owner']
		}

		return permsArray.includes(perm)
	}

	public isOwner(member: GuildMember) {
		if (member.guild.ownerId === member.id) return true
		else return false
	}

	async getPerms(member: GuildMember): Promise<perms> {
		// if (this.isOwner(member)) return 'owner'

		const roleSettings = container.cache.guilds.get(member.guild.id)?.guildSettings.staffRoles

		let found = false
		let perms = 'none'

		const owner = roleSettings?.owner
		const admin = roleSettings?.admin
		const srMod = roleSettings?.srMod
		const moderator = roleSettings?.moderator
		const helper = roleSettings?.helper
		const trialHelper = roleSettings?.trialHelper

		member.roles.cache.forEach((role) => {
			if (role.id == owner && found == false) {
				found = true
				return (perms = 'owner')
			} else if (role.id == admin && found == false) {
				found = true
				return (perms = 'admin')
			} else if (role.id == srMod && found == false) {
				found = true
				return (perms = 'srMod')
			} else if (role.id == moderator && found == false) {
				found = true
				return (perms = 'moderator')
			} else if (role.id == helper && found == false) {
				found = true
				return (perms = 'helper')
			} else if (role.id == trialHelper && found == false) {
				found = true
				return (perms = 'trialHelper')
			}
		})

		return perms as perms
	}

	async mute(member: GuildMember, time?: number) {
		try {
			if (!container.cache.guilds.get(member.guild.id)?.guildSettings.muteRole) throw new Error("I can't mute people without having a role set to mute them with.")
			const muteRole = await member.guild.roles.fetch(container.cache.guilds.get(member.guild.id)?.guildSettings.muteRole as string)
			if (!muteRole) throw new Error("I can't mute people without having a role set to mute them with.")
			await member.roles.add(muteRole)
			await container.users.editGuildEntry(member.user, member.guild.id, 'muted', { status: true, expires: time ? time : null })
			return true
		} catch (err) {
			await container.utils.error(err, {type: 'muting a member', data: {}})
			return false
		}
	}

	async unmute(member: GuildMember) {
		try {
			if (!container.cache.guilds.get(member.guild.id)?.guildSettings.muteRole) throw new Error("I can't unmute people without knowing what role to remove from them.")
			await member.roles.remove(container.cache.guilds.get(member.guild.id)?.guildSettings.muteRole as string)
			await container.users.editGuildEntry(member.user,member.guild.id, 'muted', { status: false, expires: null })
			return true
		} catch (err) {
			await container.utils.error(err, {type: 'unmuting a member', data: {}})
			return false
		}
	}

	hasRolePriority(member: GuildMember, otherMember: GuildMember) {
		if (!member.roles && !otherMember.roles) return false
		if (!member.roles && otherMember.roles) return false
		if (member.roles && !otherMember.roles) return true
		return member.roles.highest.position > otherMember.roles.highest.position
	}
}
