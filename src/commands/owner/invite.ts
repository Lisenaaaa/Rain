import { Command } from "discord-akairo";

export default class invite extends Command {
    constructor() {
        super("invite", {
            aliases: ["invite"],
        });
    }

    async exec(message) {
        if (message.author.id == 492488074442309642) {
            message.channel.send(process.env["invite"])
        }
        else {
            message.channel.send(`yeah no`)
        }
    }
}