import { Command } from "discord-akairo";
import { BotCommand } from "../../../extensions/BotCommand";

export default class bushbotcode extends BotCommand {
    constructor() {
        super("bushbotcode", {
            aliases: ["bushbotcode", 'bushcode'],
            ownerOnly: true
        });
    }

    exec(message) {
        message.channel.send("https://github.com/NotEnoughUpdates/bush-bot")
    }
}