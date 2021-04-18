import { Command } from "discord-akairo";
import { MessageEmbed } from "discord.js";

export default class serverinfo extends Command {
	constructor() {
		super("serverinfo", {
			aliases: ["serverinfo", "sinfo", "si", "server", "guild"] 
		});
	}

	exec(message) {
		const infoembed = new MessageEmbed()
		const example = `This is an example!`

        infoembed.setTitle(message.guild.name)
        .setDescription(`
		Created by: <@${message.guild.owner.id}>
		Members: \`${message.guild.memberCount}\`
		Online: \`i have no idea how to do this\`
		Example: \`${example}\`
		Example: \`${example}\`
		Example: \`${example}\`
		Example: \`${example}\`
		Example: \`${example}\`
		Example: \`${example}\`
		Example: \`${example}\`
		Example: \`${example}\`
		Example: \`${example}\`
		Example: \`${example}\``)

        message.channel.send(infoembed)
	}
}
