import { Snowflake } from 'discord.js'
import { guildCommandSettings, Modlogs } from './misc'

export interface GuildDatabase {
	guildID: Snowflake
	guildSettings: {
		muteRole: Snowflake | null
		welcomeChannel: string | null
		welcomeMessage: string | null
		loggingChannels: {
			message: Snowflake | null
			member: Snowflake | null
			moderation: Snowflake | null
			action: Snowflake | null
		}
		staffRoles: {
			owner: Snowflake | null
			admin: Snowflake | null
			srMod: Snowflake | null
			moderator: Snowflake | null
			helper: Snowflake | null
			trialHelper: Snowflake | null
		}
		lockedChannels: {
			owner: Snowflake[]
			admin: Snowflake[]
			srMod: Snowflake[]
			moderator: Snowflake[]
			helper: Snowflake[]
			trialHelper: Snowflake[]
		}
	}
	members: databaseMember[]
	commandSettings: guildCommandSettings[]
	features: { id: string; enabled: boolean }[]
}

export class GuildDatabaseConstructor {
	public constructor(options: GuildDatabase) {
		this.guildID = options.guildID
		this.guildSettings = options.guildSettings
		this.members = options.members
		this.commandSettings = options.commandSettings
		this.features = options.features
	}

	public guildID: Snowflake
	public guildSettings: {
		muteRole: Snowflake | null
		welcomeChannel: string | null
		welcomeMessage: string | null
		loggingChannels: {
			message: Snowflake | null
			member: Snowflake | null
			moderation: Snowflake | null
			action: Snowflake | null
		}
		staffRoles: {
			owner: Snowflake | null
			admin: Snowflake | null
			srMod: Snowflake | null
			moderator: Snowflake | null
			helper: Snowflake | null
			trialHelper: Snowflake | null
		}
		lockedChannels: {
			owner: Snowflake[]
			admin: Snowflake[]
			srMod: Snowflake[]
			moderator: Snowflake[]
			helper: Snowflake[]
			trialHelper: Snowflake[]
		}
	}
	members: databaseMember[]
	public commandSettings: guildCommandSettings[]
	public features: { id: string; enabled: boolean }[]
}

export class UserDatabaseConstructor {
	public constructor(options: UserDatabase) {
		this.userID = options.userID
		this.badges = options.badges
		this.superuser = options.superuser
		this.blacklisted = options.blacklisted
	}

	public userID: Snowflake
	public badges: string[]
	public superuser: boolean
	public blacklisted: boolean
}

export type UserDatabase = {
	userID: Snowflake
	badges: string[]
	superuser: boolean
	blacklisted: boolean
}

export type CommandDatabase = {
	id: string
	enabled: boolean
}

export type databaseMember = {
	id: Snowflake
	modlogs: Modlogs[]
	muted: { status: boolean; expires: number | null }
	banned: { expires: number | null }
}
