import { BotCommand } from '@extensions/BotCommand';
import commandManager from '@functions/commandManager';
import database from '@functions/database';
import utils from '@functions/utils'
import { MessageButton } from 'discord.js';
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

        const dotThen = message.channel.createMessageCollector({ filter: filterMsg, time: 15000 })

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
            if (interaction.values[0] == 'configToggleCommand') {
                const allIDs = commandManager.getAllCommandIDs(this.client)
                let idString = ''

                allIDs.forEach(id => {
                    idString += `\`${id}\`,\n`
                })
                idString = idString.substring(0, idString.length - 2)

                const allIDButton = new MessageButton()
                    .setCustomID('configViewAllCommandIDs')
                    .setLabel('Show All IDs')
                    .setStyle('PRIMARY')
                await botMsg.edit({ content: 'Please send the ID of the command you want to toggle. (they aren\'t hard to guess, the ban command\'s id is `ban`)', components: [[allIDButton]] })

                await message.channel.awaitMessageComponentInteraction({ time: 1500000 }).then(interaction => {
                    interaction.reply({ content: idString, ephemeral: true })
                })

                dotThen.once('collect', async msg => {
                    if (allIDs.includes(msg.content)) {
                        botMsg.edit('that is a command')
                    }
                })
                //interaction.reply(idString)
            }

            if (interaction.values.includes('configSetRolePerms')) {

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
                botMsg.edit({ content: 'Which position would you like to set the permissions of?', components: [roleRow] })

                await message.channel.awaitMessageComponentInteraction({ filter, time: 15000 }).then(async interaction => {
                    const position = interaction.values[0]
                    await interaction.reply({ content: `Please mention or send the ID of the role you would like to set to ${position}` })

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