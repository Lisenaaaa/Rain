import { Command } from "discord-akairo";
import { MessageEmbed } from "discord.js";

export default class info extends Command {
	constructor() {
		super("info", {
			aliases: ["info", "botinfo"] 
		});
	}

	async exec(message) {
		const infoembed = new MessageEmbed()
		.setTitle(`${this.client.user.username} Info`)
		.addField(`Source Code`, `https://github.com/Zordlan/SkyClientBot`)
		.setFooter(`More things coming here when I think of things to put here!`)
	
		message.channel.send(infoembed)
		//message.channel.send('h')
	}
}