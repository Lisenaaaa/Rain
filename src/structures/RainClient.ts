import { container, SapphireClient } from '@sapphire/framework'
import Utilities from '../functions/utilities'
import Settings from '../config/settings'
import Database from '../functions/database'
import Guilds from '../functions/objectfunctions/guilds'
import Users from '../functions/objectfunctions/users'
import Channels from '../functions/objectfunctions/channels'
import Logger from '../functions/logging'
import { Cache } from '../functions/cache'
import { Members } from '../functions/objectfunctions/members'

export class RainClient extends SapphireClient {
	public constructor() {
		super({
			caseInsensitiveCommands: true,
			caseInsensitivePrefixes: true,
			defaultPrefix: '-',
			intents: ['GUILDS', 'GUILD_MESSAGES'],
			loadDefaultErrorListeners: false,
			partials: ['CHANNEL'],
			allowedMentions: { parse: [] },
			loadMessageCommandListeners: true,
		})

		container.database = new Database()
		container.settings = new Settings()
		container.utils = new Utilities()
		container.logging = new Logger()

		container.users = new Users()
		container.guilds = new Guilds()
		container.channels = new Channels()
		container.members = new Members()

		container.cache = new Cache()
	}
}

declare module '@sapphire/pieces' {
	interface Container {
		utils: Utilities
		settings: Settings
		database: Database
		logging: Logger

		guilds: Guilds
		users: Users
		channels: Channels
		members: Members

		cache: Cache
	}
}
