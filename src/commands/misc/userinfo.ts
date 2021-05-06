import { Command } from "discord-akairo";
import { User } from "discord.js";
import { MessageEmbed } from "discord.js";
import { BotCommand } from "../../extensions/BotCommand";

export default class userinfo extends BotCommand {
	constructor() {
		super("userinfo", {
			aliases: ["userinfo", "uinfo", "ui", "user"],
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
		const userPFP = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=2048`
		const infoembed = new MessageEmbed()
			.setAuthor(user.tag, userPFP)
			.setDescription(`
			**Mention:** ${user}
			**ID:** \`${user.id}\`
			**Created at:** ${user.createdAt}
			`)


		message.channel.send(infoembed)

		user = ``
	}
}
