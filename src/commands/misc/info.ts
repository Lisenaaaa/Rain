import { Command } from "discord-akairo";

export default class info extends Command {
	constructor() {
		super("info", {
			aliases: ["info", "botinfo"] 
		});
	}

	async exec(message) {
		message.channel.send(`Hello! uh what do i put here other than its coded in typescript`)
	}
}