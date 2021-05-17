import { BotCommand } from "../../../extensions/BotCommand";

export default class docs extends BotCommand {
	constructor() {
		super("docs", {
			aliases: ["docs", "djsdocs"],
            ownerOnly: true
		});
	}

	async exec(message) {
		message.channel.send('https://discordjs.guide/popular-topics/faq.html')
	}
}