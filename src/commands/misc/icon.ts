import { Command } from "discord-akairo";
import { MessageEmbed } from "discord.js";

export default class icon extends Command {
	constructor() {
		super("icon", {
			aliases: ["icon", "servericon", "sicon"] 
		});
	}

	async exec(message) {
		const iconembed = new MessageEmbed()
		.setTitle(`${message.guild.name}'s icon`)
        .setImage(`https://cdn.discordapp.com/icons/${message.guild.id}/${message.guild.icon}.png`)
	
		message.channel.send(iconembed)
	}
}