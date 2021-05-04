import { Command } from "discord-akairo";
import utils from "../../functions/utils";

export default class discordConsole extends Command {
	constructor() {
		super("discordConsole", {
			aliases: ["discordconsole", "dconsole"],
            args: [
                {id: "thingToLog", type: "string", match: "restContent"}
            ]
		});
	}

	async exec(message, args) {
        let thingToLog = `Server: **${message.guild.name}**\nContents: ${args.thingToLog}`
		utils.console(thingToLog, message)
	}
}