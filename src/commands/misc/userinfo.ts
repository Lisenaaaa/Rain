import { Command } from "discord-akairo";
import { User } from "discord.js";
import { MessageEmbed } from "discord.js";

export default class userinfo extends Command {
	constructor() {
		super("userinfo", {
			aliases: ["userinfo", "uinfo", "ui"],
			args: [
				{
					id: 'targetUser',
					type: 'user',
				}
			]
		});
	}

	exec(message, args) {
		let user
		if (args.targetUser) {
			user = args.targetUser
		}
		else {
			user = message.author
		}
		const infoembed = new MessageEmbed()
			.setTitle(user.tag)
			.setThumbnail(`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=2048`)
			.setDescription(`
			**Mention:** ${user}
			**ID:** \`${user.id}\`
			**Created at:** ${user.createdTimestamp}
			`)


		message.channel.send(infoembed)

		user = ``
	}
}