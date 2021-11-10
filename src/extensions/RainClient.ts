import { container, SapphireClient } from "@sapphire/framework";
import Utilities from "../functions/utilities";
import Config from 'config'

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
	public owners: String[] = container.config.owners
}

declare module 'discord.js' {
	interface Client {
	}
}

declare module '@sapphire/pieces' {
	interface Container {
		utils: Utilities,
		config: Config
	}
}
