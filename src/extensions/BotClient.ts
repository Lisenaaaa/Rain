import { AkairoClient, CommandHandler, InhibitorHandler, ListenerHandler } from "discord-akairo";
import { join } from "path";

export class BotClient extends AkairoClient {
	public commandHandler: CommandHandler = new CommandHandler(this, {
		prefix: ["-", "."], 
		commandUtil: true,
		handleEdits: true,
		directory: join(__dirname, "..", "commands"),
		allowMention: true,
		automateCategories: true
	})
	public listenerHandler: ListenerHandler = new ListenerHandler(this, {
		directory: join(__dirname, "..", "listeners"),
		automateCategories: true
	})
	public inhibitorHandler: InhibitorHandler = new InhibitorHandler(this, {
		directory: join(__dirname, "..", "inhibitors")
	})
	public constructor() {
		super({
			ownerID: [
				"492488074442309642"
			]
		},
		{
			allowedMentions: {
				parse: ["users"] // Disables all mentions except for users
			}
		});
	}
	private async _init(): Promise<void> {
		this.commandHandler.useListenerHandler(this.listenerHandler);
		this.commandHandler.useInhibitorHandler(this.inhibitorHandler);
		this.listenerHandler.setEmitters({
			commandHandler: this.commandHandler,
			listenerHandler: this.listenerHandler,
			process
		});
		// loads all the stuff
		const loaders = {
			commands: this.commandHandler,
			listeners: this.listenerHandler,
			inhibitors: this.inhibitorHandler,
		};
		for (const loader of Object.keys(loaders)) {
			try {
				loaders[loader].loadAll();
				console.log("Successfully loaded " + loader + ".");
			} catch (e) {
				console.error("Unable to load " + loader + " with error " + e);
			}
		}
	}

	public async start(): Promise<string> {
		await this._init();
		//hidestream
		return this.login(process.env["token"]);
	}
}