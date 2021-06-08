import { BotCommand } from "../../../extensions/BotCommand";

export default class bushbotcode extends BotCommand {
    constructor() {
        super("bushbotcode", {
            aliases: ["bushbotcode", 'bushcode'],
            ownerOnly: true
        });
    }

    exec(message) {
        message.util.send("https://github.com/NotEnoughUpdates/bush-bot")
    }
}