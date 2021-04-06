import { Command } from "discord-akairo";
import { MessageEmbed } from "discord.js";

export default class userinfo extends Command {
	constructor() {
		super("userinfo", {
			aliases: ["userinfo", "uinfo", "ui"] 
		});
	}

	exec(message) {
        const infoembed = new MessageEmbed()
		.setTitle(message.author.tag)
        .setThumbnail(message.author.displayAvatarURL)

        
        message.channel.send(infoembed)
	}
}