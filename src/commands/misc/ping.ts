import { BotCommand } from "../../extensions/BotCommand";

export default class ping extends BotCommand {
    constructor() {
        super("ping", {
            aliases: ["ping"]
        });
    }

    exec(message) {
        message.channel.send('Pinging...').then(sent => {
            sent.edit(`Ping: ${sent.createdTimestamp - message.createdTimestamp} miliseconds`)
        })
    }
}

//stfu this isnt taken from d.js's guide
//also how else would you do it this seriously seems to be the best way to get it, but also im an absolute fucking idiot