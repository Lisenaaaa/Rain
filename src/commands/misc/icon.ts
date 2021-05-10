import { MessageEmbed } from "discord.js";
import { BotCommand } from "../../extensions/BotCommand";

export default class icon extends BotCommand {
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