import BotClient from '@extensions/RainClient'
import Utils from '@functions/utils'
import { perms } from '@src/types/misc'
import { Guild, GuildMember, Snowflake } from 'discord.js'
import { RawGuildMemberData } from 'discord.js/typings/rawDataTypes'
import { RainGuild } from './Guild'

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

	async createModlogs(type: 'BAN' | 'MUTE' | 'WARN', moderator: Snowflake, reason?: string, duration?: string) { // eslint-disable-line @typescript-eslint/no-unused-vars
		console.log(Utils.currentTimestamp())
	}
}
