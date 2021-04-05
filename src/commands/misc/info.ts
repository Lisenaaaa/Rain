import { Command } from "discord-akairo";

export default class info extends Command {
	constructor() {
		super("info", {
			aliases: ["info", "botinfo"] 
		});
	}

	exec(message) {
		//console.log("[Command ran] info")
		return message.channel.send(`Hello! uh what do i put here other than its coded in typescript`)
	}
}