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
                .setDescription(`Reloading!`)
            message.channel.send(reloadEmbed).then(async sent => {
                console.log(`Reloading!`)
                
                await sh("yarn build");

                await this.client.commandHandler.reloadAll()
                await this.client.listenerHandler.reloadAll()
                await this.client.inhibitorHandler.reloadAll()

                console.log(`Reloaded!\n`)
                
                reloadEmbed.setDescription(`Reloaded! Everything that changed in my files should now be loaded in the bot.`)
                sent.channel.send(reloadEmbed)
                sent.delete()
            })
        }
        catch (err) {
            utils.errorhandling(err, message)
        }
    }
}