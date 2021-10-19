import BotClient from '@extensions/RainClient'
import Utils from '@functions/utils'
import { perms, dbModlogs, modlogs } from '@src/types/misc'
import { Guild, GuildMember, Snowflake } from 'discord.js'
import { RawGuildMemberData } from 'discord.js/typings/rawDataTypes'
import { RainGuild } from './Guild'
import { nanoid } from 'nanoid'
import database from '@functions/database'

export class RainMember extends GuildMember {
	declare client: BotClient

	public constructor(client: BotClient, options: RawGuildMemberData, guild: Guild) {
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
		let perms = 'everyone'
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

		if (perms == 'everyone') {
			return false
		}
		if (perms == 'trialHelper') {
			permsArray = ['trialHelper']
		}
		if (perms == 'helper') {
			permsArray = ['trialHelper', 'helper']
		}
		if (perms == 'moderator') {
			permsArray = ['trialHelper', 'helper', 'moderator']
		}
		if (perms == 'srMod') {
			permsArray = ['trialHelper', 'helper', 'moderator', 'srMod']
		}
		if (perms == 'admin') {
			permsArray = ['trialHelper', 'helper', 'moderator', 'srMod', 'admin']
		}
		if (perms == 'owner') {
			permsArray = ['trialHelper', 'helper', 'moderator', 'srMod', 'admin', 'owner']
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

	async addModlogEntry(type: 'BAN' | 'MUTE' | 'WARN', moderator: Snowflake, reason?: string, duration?: string) {
		// creating the entry
		const modlogEntry: modlogs = { id: nanoid(), type: type, modID: moderator, reason: reason ? reason : 'No Reason Provided', createdTimestamp: Utils.currentTimestamp }
		if (duration) modlogEntry.duration = duration

		//getting the modlogs
		let modlogs = await this.getModlogs()

		//return modlogs

		//if the user has no modlog entries
		if (modlogs === undefined) {
			//create empty modlog setup
			const newModlogs = { memberID: this.user.id, logs: [] }
			//get the database entry
			const dbLogs = await (this.guild as RainGuild).database('modlogs')
			//put the modlogs in the database
			dbLogs.push(newModlogs)
			const edited = await database.editGuild(this.guild.id, 'modlogs', dbLogs)
			if (edited === false) return edited

			modlogs = await this.getModlogs()
			modlogs?.push(modlogEntry)
			dbLogs.find((m: dbModlogs) => m.memberID === this.id).logs.push(modlogEntry)
			const edited2 = await database.editGuild(this.guild.id, 'modlogs', dbLogs)
			return edited2
		}

		modlogs.push(modlogEntry)
		const dbLogs = await (this.guild as RainGuild).database('modlogs')
		dbLogs.find((m: dbModlogs) => m.memberID === this.id).logs.push(modlogEntry)
		const edited = await database.editGuild(this.guild.id, 'modlogs', dbLogs)
		return edited
	}

	async getModlogs(): Promise<modlogs[] | undefined> {
		const logs = (await (this.guild as RainGuild).database('modlogs')).find((m: dbModlogs) => m.memberID === this.user.id)
		if (logs === undefined) return undefined
		else return logs.logs
	}

	async clearModlogs(): Promise<boolean> {
		const logs = await (this.guild as RainGuild).database('modlogs')
		const memberLogs = logs.find((m: dbModlogs) => m.memberID === this.user.id)
		if (memberLogs === undefined) return true
		memberLogs.logs = []

		return await database.editGuild(this.guild.id, 'modlogs', logs)
	}
}
