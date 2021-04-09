import { Command } from "discord-akairo";

export default class firecode extends Command {
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