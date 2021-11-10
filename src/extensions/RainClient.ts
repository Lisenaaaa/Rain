import { container, SapphireClient } from "@sapphire/framework";
import Utilities from "../functions/utilities";
import Settings from '../config/settings'
import Database from "../functions/database";

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

declare module 'discord.js' {
	interface Client {
	}
}

declare module '@sapphire/pieces' {
	interface Container {
		utils: Utilities,
		config: Settings,
		database: Database
	}
}
