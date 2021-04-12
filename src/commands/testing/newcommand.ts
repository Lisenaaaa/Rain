import { Command } from "discord-akairo";
import { Guild, GuildMember } from "discord.js";
import { TextChannel } from "discord.js";

export default class newcommand extends Command {
    constructor() {
        super("newcommand", {
            aliases: ["newcommand"],
            ownerOnly: true
        });
    }

    async exec(message) {
        message.channel.send(`hi this is a command`)
    }
}
