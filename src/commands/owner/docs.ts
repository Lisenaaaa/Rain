import { Command } from "discord-akairo";
import { MessageEmbed } from "discord.js";

export default class docs extends Command {
	constructor() {
		super("docs", {
			aliases: ["docs", "djsdocs"],
            ownerOnly: true
		});
	}

	async exec(message) {
		message.channel.send('https://discordjs.guide/popular-topics/faq.html')
	}
}