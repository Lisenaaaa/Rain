import { container, SapphireClient } from '@sapphire/framework'
import Utilities from '../functions/utilities'
import * as config from '../config/config'
import Guilds from '../functions/objectfunctions/guilds'
import Users from '../functions/objectfunctions/users'
import Channels from '../functions/objectfunctions/channels'
import RainLogger from '../functions/logging'
import { Members } from '../functions/objectfunctions/members'
import { Perms } from '../types/misc'
import { RainTaskStore } from './RainTaskStore'
import { ApplicationCommandOptionData, PermissionString, Snowflake } from 'discord.js'
import { CommandDatabase } from '../functions/databases/commands'
import { GuildDatabase } from '../functions/databases/guild'
import { GuildCommandDatabase } from '../functions/databases/guildCommands'
import { MemberDatabase } from '../functions/databases/members'
import { ModlogDatabase } from '../functions/databases/modlogs'

class Db {
	commands = CommandDatabase // = new CommandDatabase()
	guilds = GuildDatabase // = new GuildDatabase()
	guildCommands = GuildCommandDatabase // = new GuildCommandDatabase()
	members = MemberDatabase // = new MemberDatabase()
	modlogs = ModlogDatabase // = new ModlogDatabase()
}

export class RainClient extends SapphireClient {
	public constructor(level: number) {
		super({
			caseInsensitiveCommands: true,
			caseInsensitivePrefixes: true,
			defaultPrefix: '-',
			intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_MEMBERS', 'GUILD_PRESENCES', 'GUILD_BANS'],
			loadDefaultErrorListeners: false,
			partials: ['CHANNEL'],
			allowedMentions: { parse: [] },
			loadMessageCommandListeners: true,
			logger: {
				instance: new RainLogger(level),
			},
		})

		container.settings = config
		container.utils = new Utilities()
		container.database = new Db()
		container.constants = constants

		container.users = new Users()
		container.guilds = new Guilds()
		container.channels = new Channels()
		container.members = new Members()

		this.stores.register(new RainTaskStore())
	}
}

declare module '@sapphire/pieces' {
	interface Container {
		utils: Utilities
		settings: typeof config
		database: Db
		constants: typeof constants,

		guilds: Guilds
		users: Users
		channels: Channels
		members: Members
	}
}

declare module '@sapphire/framework' {
	interface CommandOptions {
		defaultPermissions: Perms
		botPerms: PermissionString[]
		userDiscordPerms?: PermissionString[]
		slashOptions?: {
			options?: ApplicationCommandOptionData[]
			idHints?: Snowflake[]
			description?: string
			guildIDs?: Snowflake[]
		}
	}
	interface Command {
		defaultPermissions: Perms
		botPerms: PermissionString[]
		userDiscordPerms?: PermissionString[]
		slashOptions?: {
			options?: ApplicationCommandOptionData[]
			idHints?: Snowflake[]
			description?: string
			guildIDs?: Snowflake[]
		}
	}

	interface StoreRegistryEntries {
		tasks: RainTaskStore
	}
}

const constants = {
	WelcomeLeaveVarsLink: 'https://skyblock-plus-logs.vercel.app/logs?url=https://hst.sh/raw/idejupicax',
}