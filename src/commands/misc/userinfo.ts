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
			.setThumbnail(`https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png?size=2048`)
			.setDescription(`
			**Mention:** ${message.author}
			**ID:** \`${message.author.id}\`
			**Created at:** ${message.author.createdTimestamp}
			`)


		message.channel.send(infoembed)
	}
}