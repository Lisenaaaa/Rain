import { Snowflake } from 'discord.js'

export type perms = 'owner' | 'admin' | 'srMod' | 'moderator' | 'helper' | 'trialHelper'
export type EvalOptions = { codetoeval: string; silent: boolean; sudo: boolean }
export type modlogs = { type: 'BAN' | 'MUTE' | 'WARN'; userID: Snowflake; modID: Snowflake; reason: string; duration: string }
export type guildCommandSettings = { id: string; enabled: boolean; lockedRoles: perms[]; lockedChannels: Snowflake[] }
export type database = {
	guildID: Snowflake
	guildSettings: {
		welcomeChannel: 'null'
		welcomeMessage: string
		loggingChannels: { message: string; member: string; moderation: string; action: string }
		staffRoles: { owner: Snowflake | null; admin: Snowflake | null; srMod: Snowflake | null; moderator: Snowflake | null; helper: Snowflake | null; trialHelper: Snowflake | null }
		lockedChannels: { owner: Snowflake[]; admin: Snowflake[]; srMod: Snowflake[]; moderator: Snowflake[]; helper: Snowflake[]; trialHelper: Snowflake[] }
		modlogs: { memberID: Snowflake; logs: modlogs[] }[]
	}
	commandSettings: guildCommandSettings[]
	features: { id: string; enabled: boolean }[]
}
export type dbModlogs = {memberID:Snowflake,logs:modlogs[]}