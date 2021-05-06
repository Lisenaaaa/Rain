import { Command } from "discord-akairo";
import { BotCommand } from "../../extensions/BotCommand"
import utils from '../../functions/utils'
import { exec } from 'child_process';
import { promisify }  from 'util';

const sh = promisify(exec)

export default class reload extends BotCommand {
    constructor() {
        super("reload", {
            aliases: ["reload"],
            ownerOnly: true
        });
    }


    async exec(message) {
        //THIS IS BROKEN AND DOES LITERALLY NOTHING RIGHT NOW OTHER THAN SEND A MESSAGE AND I DONT KNOW WHY SOMEONE PLEASE HELP AAAAAAAAAAAAAAAAAAA
        try {
            await sh("yarn build");
            await this.client.commandHandler.reloadAll()
            await message.channel.send(`Maybe reloaded commands?`)
        }
        catch (err) {
            utils.errorhandling(err, message)
        }
    }
}