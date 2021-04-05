import { Command } from "discord-akairo";

export default class newcommand extends Command {
    constructor() {
        super("newcommand", {
            aliases: ["newcommand"],
        });
    }

    async exec(message) {
        await message.channel.send("join skyclient discord or fucking die")
    }
}
