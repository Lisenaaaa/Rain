import { Command, CommandOptions } from "discord-akairo";
import { BotClient } from "./BotClient";

export class BotCommand extends Command {
	declare client: BotClient
	usage: string;

	public constructor(id: string, options: BotCommandOptions) {
        super(id, options)
		this.usage = options.usage
    }
}

interface BotCommandOptions extends CommandOptions {
	description?: string
	usage?: string
	discordPerms?: Array<string>
}