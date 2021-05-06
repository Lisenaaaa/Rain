import { Command } from "discord-akairo";
import { BotCommand } from "../../extensions/BotCommand"
import utils from '../../functions/utils'
import { exec } from 'child_process';
import { promisify } from 'util';
import { MessageEmbed } from "discord.js";

const sh = promisify(exec)

export default class reload extends BotCommand {
    constructor() {
        super("reload", {
            aliases: ["reload"],
            ownerOnly: true
        });
    }


    async exec(message) {
        try {
            const reloadEmbed = new MessageEmbed()
                .setDescription(`Reloading commands and listeners!`)
            message.channel.send(reloadEmbed).then(async sent => {
                await sh("yarn build");
                await this.client.commandHandler.reloadAll()
                await this.client.listenerHandler.reloadAll()
                reloadEmbed.setDescription(`Commands and listeners reloaded!`)
                sent.edit(reloadEmbed)
            })
        }
        catch (err) {
            utils.errorhandling(err, message)
        }
    }
}