import { BotCommand } from '@extensions/BotCommand';
import commandManager from '@functions/commandManager';
import database from '@functions/database';
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

        const filter = i => i.user.id == message.author.id
        const filterMsg = m => m.author.id == message.author.id

        const row = new MessageActionRow().addComponents(
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

        const botMsg = await message.reply({ content: 'config (you have 15 seconds to choose an option this may go up later but probably not)', components: [row] })

        await message.channel.awaitMessageComponentInteraction({ filter, time: 15000 }).then(async interaction => {
            //console.log(interaction.values)
            if (interaction.values[0] == 'configToggleCommand') {
                interaction.reply({ content: 'you have chosen to toggle a command', ephemeral: true })
                botMsg.edit(`**${message.author.tag}** is currently configuring my settings\ncurrent config menu: toggle commands`)
            }

            if (interaction.values.includes('configSetRolePerms')) {
                //botMsg.edit(`**${message.author.tag}** is currently configuring my settings\ncurrent config menu: change role permissions`)

                const roleRow = new MessageActionRow().addComponents(
                    new MessageSelectMenu()
                        .setCustomID('configCommandSetRolePermsDropdown')
                        .setPlaceholder('I can\'t change the permissions of nothing!')
                        .addOptions([
                            {
                                label: 'Owner',
                                description: 'The role that the server\'s owner has',
                                value: 'owner'
                            },
                            {
                                label: 'Admin',
                                description: 'The role that the server\'s administrators have',
                                value: 'admin'
                            },
                            {
                                label: 'Sr. Moderator',
                                description: 'The role that the server\'s senior mods have',
                                value: 'srMod'
                            },
                            {
                                label: 'Moderator',
                                description: 'The role that the server\'s moderators have',
                                value: 'moderator'
                            },
                            {
                                label: 'Helper',
                                description: 'The role that the server\'s helpers have',
                                value: 'helper'
                            },
                            {
                                label: 'Trial Helper',
                                description: 'The role that the server\'s trial helpers have',
                                value: 'trialHelper'
                            }
                        ])
                )
                interaction.reply({ content: 'Which position would you like to set the permissions of?', components: [roleRow] })




                await message.channel.awaitMessageComponentInteraction({ filter, time: 15000 }).then(async interaction => {
                    const position = interaction.values[0]
                    await interaction.reply({ content: `Please mention or send the ID of the role you would like to set to ${position}` })
                    const dotThen = message.channel.createMessageCollector({ filter: filterMsg, time: 15000 })
                    let role
                    dotThen.once('collect', async msg => {
                        if (msg.author.id != message.author.id) { return msg.reply('you cant do that') }
                        role = this.client.util.resolveRole(msg.content, msg.guild.roles.cache)
                        if (role == undefined) {
                            await msg.reply('That isn\'t a role. You have one more try.')
                            dotThen.once('collect', async msg => {
                                role = this.client.util.resolveRole(msg.content, msg.guild.roles.cache)
                                if (role == undefined) {
                                    return msg.reply('That isn\'t a role. This command has expired.')
                                }
                                else {
                                    msg.reply(`Set **${role.name}** to ${position}`)
                                    await database.editRolePermissions(message.guild.id, position, role.id)
                                }
                            })
                        }
                        else {
                            msg.reply(`Set ${role} to ${position}`)
                            await database.editRolePermissions(message.guild.id, position, role.id)
                        }
                    })
                })
            }
        })
    }
}