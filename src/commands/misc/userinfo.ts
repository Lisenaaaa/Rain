import { MessageEmbed } from "discord.js";
import { BotCommand } from "../../extensions/BotCommand";

export default class userinfo extends BotCommand {
	constructor() {
		super("userinfo", {
			aliases: ["userinfo", "uinfo", "ui", "user"],
			args: [
				{
					id: 'targetUser',
					type: 'member',
				}
			]
		});
	}

	exec(message, args) {
		let user
		let member

		if (args.targetUser) {
			user = args.targetUser.user
			member = args.targetUser
		}
		else {
			user = message.author
			member = message.member
		}
		
		const userPFP = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=2048`
		const infoembed = new MessageEmbed()
			.setAuthor(user.tag, userPFP)
			.setDescription(`
			**Mention:** ${user}
			**ID:** \`${user.id}\`
			**Created at:** ${user.createdAt.toLocaleString()}
			`)


		message.channel.send(infoembed)

		user = ``
	}
}
