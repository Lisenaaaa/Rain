import { container, SapphireClient } from '@sapphire/framework'
import Utilities from '../functions/utilities'
import Settings from '../config/settings'
import Database from '../functions/database'
import Guilds from '../functions/objectfunctions/guilds'
import Users from '../functions/objectfunctions/users'
import Channels from '../functions/objectfunctions/channels'
import RainLogger from '../functions/logging'
import { Cache } from '../functions/cache'
import { Members } from '../functions/objectfunctions/members'
import { Perms } from '../types/misc'
import { RainTaskStore } from './RainTaskStore'
import { ApplicationCommandOptionData, PermissionResolvable, Snowflake } from 'discord.js'

export class RainClient extends SapphireClient {
	public constructor(level: number) {
		super({
			caseInsensitiveCommands: true,
			caseInsensitivePrefixes: true,
			defaultPrefix: '-',
			intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_MEMBERS'],
			loadDefaultErrorListeners: false,
			partials: ['CHANNEL'],
			allowedMentions: { parse: [] },
			loadMessageCommandListeners: true,
			logger: {
				instance: new RainLogger(level),
			},
		})

		container.database = new Database()
		container.settings = new Settings()
		container.utils = new Utilities()

		container.users = new Users()
		container.guilds = new Guilds()
		container.channels = new Channels()
		container.members = new Members()

		container.cache = new Cache()

		this.stores.register(new RainTaskStore())
	}
}

declare module '@sapphire/pieces' {
	interface Container {
		utils: Utilities
		settings: Settings
		database: Database

		guilds: Guilds
		users: Users
		channels: Channels
		members: Members

		cache: Cache
	}
}

declare module '@sapphire/framework' {
	interface CommandOptions {
		defaultPermissions: Perms
		botPerms?: PermissionResolvable[]
		slashOptions?: {
			options?: ApplicationCommandOptionData[]
			idHints?: Snowflake[]
			description?: string
			guildIDs?: Snowflake[]
		}
	}
	interface Command {
		defaultPermissions: Perms
		botPerms?: PermissionResolvable[]
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
