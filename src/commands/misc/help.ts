import { MessageEmbed } from "discord.js";
import { BotCommand } from "../../extensions/BotCommand";

export default class help extends BotCommand {
	constructor() {
		super("help", {
			aliases: ["help"] 
		});
	}

	async exec(message) {
        //https://discord.gg/3YpNytZe5v
        //For now, sadly, there is no full list of all the commands. I'm still in development, and my dev doesn't want to go add more to an embed every time she adds a new command. However, I do have a support discord!

        const helpembed = new MessageEmbed()
        .setTitle(`Help`)
        //.setDescription(`For now, sadly, there is no full list of all the commands. I'm still in development, and my dev doesn't want to go add more to an embed every time she adds a new command. However, I do have a support discord, where you can ask if specific commands exist, and *probably* get them made, if they don't already exist, and aren't too unreasonable!\nCurrently, the only moderation command is \`-ban\`, but this will probably be changing soon.\n\nhttps://discord.gg/3YpNytZe5v`)
        .setDescription(`
        For now, sadly, there is no full list of all the commands, as I'm still in development.
        My dev doesn't want to add more to this every time she makes a new command, as that would just be one more thing to remember, that she doesn't really want to have to deal with.
        If you want to ask about a specific command, consider joining my [discord server](https://discord.gg/3YpNytZe5v)!

        There are currently no moderation commands other than \`-ban\`, although \`-warn\` might be coming soon.
        `)

        message.channel.send(helpembed)
	}
}