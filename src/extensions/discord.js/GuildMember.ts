import RainClient from '@extensions/RainClient'
import { perms } from '@src/types/misc'
import { Guild, GuildMember } from 'discord.js'
import { RawGuildMemberData } from 'discord.js/typings/rawDataTypes'
import { RainGuild } from './Guild'
import database from '@functions/database'
import { databaseMember } from '@src/types/database'
import { RainUser } from './User'

export class RainMember extends GuildMember {
	declare client: RainClient

	public constructor(client: RainClient, options: RawGuildMemberData, guild: Guild) {
		super(client, options, guild)
	}

	get importantPerms() {
		const permsArray = this.permissions.toArray()
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

	async hasPermission(perm: perms): Promise<boolean> {
		if (this.user.id === this.guild.ownerId) return true

		const roleSettings = (await (this.guild as RainGuild).database())?.guildSettings.staffRoles

		let found = false
		let perms = null
		let permsArray: perms[] = []

		const owner = roleSettings?.owner
		const admin = roleSettings?.admin
		const srMod = roleSettings?.srMod
		const moderator = roleSettings?.moderator
		const helper = roleSettings?.helper
		const trialHelper = roleSettings?.trialHelper

		this.roles.cache.forEach((role) => {
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

	get isOwner() {
		if (this.guild.ownerId === this.id) return true
		else return false
	}

	async perms(): Promise<perms | 'none'> {
		if (this.isOwner) return 'owner'

		const roleSettings = await (this.guild as RainGuild).database('guildSettings.staffRoles')

		let found = false
		let perms = 'none'

		const owner = roleSettings?.owner
		const admin = roleSettings?.admin
		const srMod = roleSettings?.srMod
		const moderator = roleSettings?.moderator
		const helper = roleSettings?.helper
		const trialHelper = roleSettings?.trialHelper

		this.roles.cache.forEach((role) => {
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

		return perms as perms | 'none'
	}

	// async addModlogEntry(type: modlogTypes, moderator: Snowflake, data: { reason?: string; duration?: string }) {
	// 	if (!type) throw new Error("You can't make a modlog entry without a type!")
	// 	if (!moderator) moderator = this.client.user?.id as string
	// 	const modlogEntry: modlogs = { id: nanoid(), type: type, modID: moderator, reason: data.reason ? data.reason : 'No Reason Provided', createdTimestamp: Utils.now }

	// 	if (data.duration) modlogEntry.duration = data.duration

	// 	let modlogs = await (this.user as RainUser).getModlogs(this.guild.id)

	// 	if (modlogs === undefined) {
	// 		//@ts-ignore what
	// 		const newModlogs: databaseMember = { id: this.user.id, modlogs: [], muted: { status: false, expires: null } }
	// 		const dbLogs = await (this.guild as RainGuild).database('members')
	// 		dbLogs.push(newModlogs)
	// 		const edited = await database.editGuild(this.guild.id, 'members', dbLogs)
	// 		if (edited === false) return edited

	// 		modlogs = await (this.user as RainUser).getModlogs(this.guild.id)
	// 		modlogs?.push(modlogEntry)
	// 		dbLogs.find((m: databaseMember) => m.id === this.id).modlogs.push(modlogEntry)
	// 		const edited2 = await database.editGuild(this.guild.id, 'members', dbLogs)
	// 		return edited2
	// 	}

	// 	modlogs.push(modlogEntry)
	// 	const dbLogs = await (this.guild as RainGuild).database('members')
	// 	dbLogs.find((m: databaseMember) => m.id === this.id).modlogs.push(modlogEntry)
	// 	const edited = await database.editGuild(this.guild.id, 'members', dbLogs)
	// 	return edited
	// }

	async clearModlogs(): Promise<boolean> {
		return await (this.user as RainUser).editGuildEntry(this.guild.id, 'modlogs', [])
	}

	async mute(time?: number) {
		try {
			if (!(await (this.guild as RainGuild).database('guildSettings.muteRole'))) throw new Error("I can't mute people without having a role set to mute them with.")
			const muteRole = await this.guild.roles.fetch(await (this.guild as RainGuild).database('guildSettings.muteRole'))
			if (!muteRole) throw new Error("I can't mute people without having a role set to mute them with.")
			await this.roles.add(muteRole)
			await (this.user as RainUser).editGuildEntry(this.guild.id, 'muted', { status: true, expires: time ? time : null })
			return true
		} catch (err) {
			await this.client.utils.error(err)
			return false
		}
	}

	async unmute() {
		try {
			if (!(await (this.guild as RainGuild).database('guildSettings.muteRole'))) throw new Error("I can't unmute people without knowing what role to remove from them.")
			await this.roles.remove(await (this.guild as RainGuild).database('guildSettings.muteRole'))
			await (this.user as RainUser).editGuildEntry(this.guild.id, 'muted', { status: false, expires: null })
			return true
		} catch (err) {
			await this.client.utils.error(err)
			return false
		}
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	async database(query?: string): Promise<any> {
		let db = (await (this.guild as RainGuild).database('members')).find((m: databaseMember) => m.id === this.id)
		if (db === undefined) {
			//@ts-ignore what
			const newModlogs: databaseMember = { id: this.user.id, modlogs: [], muted: { status: false, expires: null } }
			const dbLogs = await (this.guild as RainGuild).database('members')
			dbLogs.push(newModlogs)
			const edited = await database.editGuild(this.guild.id, 'members', dbLogs)
			if (edited === false) return edited
			db = (await (this.guild as RainGuild).database('members')).find((m: databaseMember) => m.id === this.id)
		}

		if (query) {
			const queryArray = query.split('.')
			let dbObject = db
			queryArray.forEach((query) => {
				//@ts-ignore ok typescript
				dbObject = dbObject?.[query as keyof typeof dbObject]
			})

			return dbObject
		} else return db
	}

	hasRolePriority(otherMember: RainMember) {
		return this.roles.highest.position > otherMember.roles.highest.position
	}
}
