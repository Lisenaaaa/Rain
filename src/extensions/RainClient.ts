import { SapphireClient } from "@sapphire/framework";
import Utilities from "../functions/utilities";
import Settings from '../config/settings'
import Database from "../functions/database";
import Guilds from "../functions/objectfunctions/guilds";
import Users from "../functions/objectfunctions/users";
import Channels from "../functions/objectfunctions/channels";

export class RainClient extends SapphireClient {
	public constructor() {
		super({
			caseInsensitiveCommands: true,
			caseInsensitivePrefixes: true,
			defaultPrefix: '-',
			intents: [
				'GUILDS',
				'GUILD_MESSAGES'
			],
			loadDefaultErrorListeners: false,
			partials: ['CHANNEL'],
			allowedMentions: {parse: []}
		});
	}
}

declare module '@sapphire/pieces' {
	interface Container {
		utils: Utilities,
		config: Settings,
		database: Database,

		guilds: Guilds,
		users: Users,
		channels: Channels
	}
}
