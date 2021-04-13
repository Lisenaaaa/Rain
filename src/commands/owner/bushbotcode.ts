import { Command } from "discord-akairo";

export default class bushbotcode extends Command {
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