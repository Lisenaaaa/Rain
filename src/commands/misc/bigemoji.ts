import { Command } from "discord-akairo";
import { MessageEmbed } from "discord.js";

export default class bigemoji extends Command {
    constructor() {
        super("bigemoji", {
            aliases: ["bigemoji"],
            args: [
                {
                    id: "emoji",
                    type: "emoji"
                }
            ]
        });
    }

    async exec(message, args) {
        if (args.emoji.url) {
            message.channel.send(args.emoji.url)
        }
        else {
            message.channel.send(`I can't do that, because Discord doesn't let me get the URLs of default emojis!`)
        }
    }
}