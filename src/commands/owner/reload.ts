import { Command } from "discord-akairo";
import { BotCommand } from "../../extensions/BotCommand"
import utils from '../../functions/utils'

export default class reload extends Command {
    constructor() {
        super("reload", {
            aliases: ["reload"],
            ownerOnly: true
        });
    }


    async exec(message) {
        //THIS IS BROKEN AND DOES LITERALLY NOTHING RIGHT NOW OTHER THAN SEND A MESSAGE AND I DONT KNOW WHY SOMEONE PLEASE HELP AAAAAAAAAAAAAAAAAAA
        try {
            this.handler.reloadAll()
            message.channel.send(`Maybe reloaded commands?`)
        }
        catch (err) {
            utils.errorhandling(err, message)
        }
    }
}