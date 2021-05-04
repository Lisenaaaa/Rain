import { Command } from "discord-akairo";
import { MessageEmbed } from "discord.js";

export default class e extends Command {
    constructor() {
        super("e", {
            aliases: ["e"],
            ownerOnly: true
        });
    }

    async exec(message) {
        // sleep time expects milliseconds
        function sleep(time) {
            return new Promise((resolve) => setTimeout(resolve, time));
        }

        // Usage!
        message.channel.send(`e`)
        sleep(2000).then(() => {
            // Do something after the sleep!
            message.channel.send(`e v2`)
        });
    }
}