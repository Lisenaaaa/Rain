import { BotCommand } from "@extensions/BotCommand"
import { exec } from 'child_process';
import { promisify } from 'util';
import { MessageEmbed } from "discord.js";
import chalk from "chalk";

const sh = promisify(exec)

export default class reload extends BotCommand {
    constructor() {
        super("reload", {
            aliases: ["reload"],
            ownerOnly: true
        });
    }


    async exec(message) {
        const reloadEmbed = new MessageEmbed()
            .setDescription(`Reloading!`)
            .setColor(message.member.displayColor)
        message.util.send({ embeds: [reloadEmbed] }).then(async sent => {
            console.log(chalk.greenBright(`Reloading!`))

            await sh("yarn build");

            await this.client.commandHandler.reloadAll()
            await this.client.listenerHandler.reloadAll()
            await this.client.inhibitorHandler.reloadAll()
            await this.client.taskHandler.reloadAll()

            console.log(chalk.green(`Reloaded!\n`))

            reloadEmbed.setDescription(`Reloaded! Everything that changed in my files (that are managed by Akairo) should now be loaded in the bot.\n**If you want to reload functions or client stuff, restart the bot**`)
            sent.channel.send({ embeds: [reloadEmbed] })
            sent.delete()
        })
    }
}