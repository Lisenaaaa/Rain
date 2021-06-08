import { BotCommand } from "../../../extensions/BotCommand";

export default class invite extends BotCommand {
    constructor() {
        super("invite", {
            aliases: ["invite"],
            ownerOnly: true
        });
    }

    async exec(message) {
        if (message.author.id == 492488074442309642) {
            message.author.send(process.env["invite"])
            message.util.send(`Invite has been sent to you.`)
        }
        else {
            message.util.send(`and why exactly would i let you invite me to your server?`)
        }
    }
}
