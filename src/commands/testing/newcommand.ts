import { Command } from "discord-akairo";
import { TextChannel } from "discord.js";

export default class newcommand extends Command {
    constructor() {
        super("newcommand", {
            aliases: ["newcommand"],
        });
    }

    async exec(message) {
        if (message.author.id = "492488074442309642") {
            await message.channel.send(`pain`)
            const channel = this.client.channels.cache.get('824680358494076959') as TextChannel
            channel.send("hello")
        }
        else {
            message.channel.send("This command is used for testing purposes, and can only be used by Zordlan.")
        }
    }
}
