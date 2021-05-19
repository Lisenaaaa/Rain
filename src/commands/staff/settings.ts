import { MessageEmbed } from 'discord.js';
import { BotCommand } from '../../extensions/BotCommand';
import db from '../../functions/database';

export default class settings extends BotCommand {
    constructor() {
        super('settings', {
            aliases: ['settings'],
            channel: 'guild'
        });
    }

    async exec(message) {
        const settings = await db.guildSettings(message.guild.id)
        
        let settingsEmbed = new MessageEmbed()
            .setTitle(`${message.guild.name}'s settings`)
            .addFields(
                {name: `Prefix`, value: settings.prefix},
                {name: `Fancy Moderation Embeds`, value: settings.fancyModerationEmbeds}
            )

        message.channel.send(settingsEmbed)
    }
}
