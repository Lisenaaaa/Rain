import { Command } from "discord-akairo";

export default class invite extends Command {
    constructor() {
        super("invite", {
            aliases: ["invite"],
            ownerOnly: true
        });
    }

    async exec(message) {
        if (message.author.id == 492488074442309642) {
            message.author.send(process.env["invite"])
            message.channel.send(`Invite has been sent to you.`)
        }
        else {
            message.channel.send(`and why exactly would i let you invite me to your server?`)
        }
    }
}
