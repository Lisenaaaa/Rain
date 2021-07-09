import { BotCommand } from '@extensions/BotCommand';
import commandManager from '@functions/commandManager';
import utils from '@functions/utils'
import { MessageActionRow, MessageSelectMenu } from 'discord.js';

export default class config extends BotCommand {
    constructor() {
        super('config', {
            aliases: ['config'],
            description: 'configure the bot',
            usage: '-config',
            discordPerms: ['MANAGE_GUILD'],

            slash: true,
            slashGuilds: utils.slashGuilds
        })
    }
    async exec(message) {
        if (!await commandManager.checkIfCommandCanBeUsed(message, this.id)) {
            return message.reply('<a:nonofast:862857752124194816> you arent cool enough to config')
        }

        const row = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomID('configCommand1')
                    .setPlaceholder('Nothing selected')
                    .addOptions([
                        {
                            label: 'Toggle commands',
                            description: 'enable/disable a command',
                            value: 'configToggleCommand',
                        },
                        {
                            label: 'Set role permissions',
                            description: 'Set a role to admin, moderator, helper, etc',
                            value: 'configSetRolePerms'
                        }
                    ])
            )

        message.reply({ content: 'config', components: [row] })

        await message.channel.awaitMessageComponentInteraction({ time: 15000 }).then(interaction => {
            console.log(interaction.values)
            if (interaction.values[0] == 'configToggleCommand') {
                interaction.reply({ content: 'you have chosen to toggle a command', ephemeral: true })
            }
            
            if (interaction.values.includes('configSetRolePerms')) {
                interaction.reply({ content: 'you have chosen to set/change role permissions', ephemeral: true })
            }
        })
    }
}