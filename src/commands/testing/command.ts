import { Command } from "discord-akairo";

export default class command extends Command {
	constructor() {
		super("command", {
			aliases: ["command"],
			ownerOnly: true
		});
	}

	async exec(message) {
		await message.channel.send("this is a command")
	}
}