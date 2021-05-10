import { BotCommand } from "../../../extensions/BotCommand";

export default class firecode extends BotCommand {
    constructor() {
        super("firecode", {
            aliases: ["firecode"],
            ownerOnly: true
        });
    }

    exec(message) {
        message.channel.send("https://github.com/FireDiscordBot/bot")
    }
}