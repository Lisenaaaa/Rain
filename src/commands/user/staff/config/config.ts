import { RainChannel } from '@extensions/discord.js/Channel'
import { RainGuild } from '@extensions/discord.js/Guild'
import { DRainMessage } from '@extensions/discord.js/Message'
import { RainCommand } from '@extensions/RainCommand'
import database from '@functions/database'
import Handler from '@functions/handler'
import utils from '@functions/utils'
import { perms } from '@src/types/misc'
import { AkairoMessage, GuildTextBasedChannels } from 'discord-akairo'
import {
	BaseGuildVoiceChannel,
	ButtonInteraction,
	Collection,
	Interaction,
	InteractionReplyOptions,
	Message,
	MessageActionRow,
	MessageButton,
	MessageComponentInteraction,
	Role,
	Snowflake,
} from 'discord.js'

export default class Config extends RainCommand {
	constructor() {
		super('config', {
			aliases: ['config'],
			description: 'configure the bot',
			discordPerms: ['MANAGE_GUILD'],

			slash: true,
			slashGuilds: utils.slashGuilds,
			defaultPerms: 'srMod',
			rainPerms: ['SEND_MESSAGES'],
		})
	}

	async exec(message: DRainMessage) {
		await message.reply('use this as a slashcommand')
	}

	async execSlash(message: AkairoMessage) {
		const interaction = message.interaction
		if (!message.guild) return await message.reply({ content: "This won't work if it isn't on a server!", ephemeral: true } as InteractionReplyOptions)
		if (!message.channel) {
			await this.client.utils.console(`someone managed to run the config command without a channel, here's the message ${await utils.haste(JSON.stringify(message))}`)
			return await message.reply({
				content: "somehow you managed to run this command without it being in a channel, i (the dev) am confused about how this could even be possible so i've logged the message data",
				ephemeral: true,
			} as InteractionReplyOptions)
		}

		const filter = (i: Interaction) => i.user.id == interaction.user.id
		const filterMsg = (m: Message) => m.author.id == interaction.user.id
		const filterRestrictChannels = (i: MessageComponentInteraction) => i.user.id === interaction.user.id && i.customId.startsWith('configRestrictChannels')
		const filterLog = (i: MessageComponentInteraction) => i.user.id === interaction.user.id && i.customId.startsWith('configLog')
		const filterStaffRoles = (i: MessageComponentInteraction) => i.user.id === interaction.user.id && i.customId.startsWith('configStaffRoles')

		const interactionCollector = message.channel?.createMessageComponentCollector({ filter, time: 60000 })
		const configRestrictChannelsInteractionCollector = message.channel?.createMessageComponentCollector({ filter: filterRestrictChannels, time: 60000 })
		const configLogInteractionCollector = message.channel?.createMessageComponentCollector({ filter: filterLog, time: 60000 })
		const staffRolesInteractionCollector = message.channel?.createMessageComponentCollector({ filter: filterStaffRoles, time: 60000 })
		const messageCollector = message.channel?.createMessageCollector({ filter: filterMsg, time: 60000 })

		const OptionsRow = new MessageActionRow().addComponents(
			new MessageButton({ customId: 'configRestrictChannels', label: 'Restrict Channels', style: 'PRIMARY' }),
			new MessageButton({ customId: 'configLogChannels', label: 'Logging Channels', style: 'PRIMARY' }),
			new MessageButton({ customId: 'configStaffRoles', label: 'Staff Roles', style: 'PRIMARY' }),
			new MessageButton({ customId: 'configLockCommand', label: 'Set Command Permissions', style: 'PRIMARY' }),
			new MessageButton({ customId: 'configMuteRole', label: 'Set Muted Role', style: 'PRIMARY' })
		)

		await message.reply({
			embeds: [
				{
					title: `${message.guild.name}'s config`,
					description: `configure the bot\neach prompt/button has a 60 second time before it will stop listening for responses`,
					fields: [
						{ name: 'Restrict Channels', value: 'Lock specific channels, so that only users with specific permissions can use my commands in them.', inline: true },
						{ name: 'Logging Channels', value: 'Set channels for me to log server-related information in.', inline: true },
						{ name: 'Staff Roles', value: 'Set up roles to use my custom permission system. This is highly recommended.', inline: true },
						{ name: 'Set Command Permissions', value: 'Set the custom permissions for any command.', inline: true },
						{ name: 'Set Muted Role', value: 'Set my muted role. **This is required for `/mute` to work.**', inline: true },
					],
				},
			],
			components: [OptionsRow],
		})

		interactionCollector?.once('collect', async (i) => {
			switch (i.customId) {
				case 'configRestrictChannels': {
					await message.interaction.editReply({ content: 'What channel would you like to edit?', embeds: [], components: [] })
					await i.deferUpdate()

					messageCollector?.once('collect', async (m) => {
						await m.delete()

						const channel = await this.client.util.resolveChannel(m.content, m.guild?.channels.cache as Collection<string, GuildTextBasedChannels | BaseGuildVoiceChannel>)

						if (channel === undefined) {
							await message.interaction.editReply({ content: "I couldn't find that channel.", embeds: [], components: [] })
							return
						}
						if (channel.type != 'GUILD_TEXT') {
							await message.interaction.editReply({ content: `${channel} is not a valid channel.`, embeds: [], components: [] })
							return
						}

						const restrictChannelPermsRow1 = new MessageActionRow().addComponents(
							new MessageButton({ customId: 'configRestrictChannels|owner', label: 'Owner', style: 'PRIMARY' }),
							new MessageButton({ customId: 'configRestrictChannels|admin', label: 'Admin', style: 'PRIMARY' }),
							new MessageButton({ customId: 'configRestrictChannels|srMod', label: 'Sr. Mod', style: 'PRIMARY' })
						)
						const restrictChannelPermsRow2 = new MessageActionRow().addComponents(
							new MessageButton({ customId: 'configRestrictChannels|moderator', label: 'Moderator', style: 'PRIMARY' }),
							new MessageButton({ customId: 'configRestrictChannels|helper', label: 'Helper', style: 'PRIMARY' }),
							new MessageButton({ customId: 'configRestrictChannels|trialHelper', label: 'Trial Helper', style: 'PRIMARY' })
						)
						await message.interaction.editReply({
							content: `Alright! What perms would you like to restrict ${channel} to?`,
							embeds: [],
							components: [restrictChannelPermsRow1, restrictChannelPermsRow2],
						})

						configRestrictChannelsInteractionCollector?.once('collect', async (i: ButtonInteraction) => {
							const perm = i.customId.split('|')[1]
							await i.deferUpdate()

							const confirmationRow = new MessageActionRow().addComponents(
								new MessageButton({ customId: 'configYes', label: 'Yes', style: 'SUCCESS' }),
								new MessageButton({ customId: 'configNo', label: 'No', style: 'DANGER' })
							)
							await interaction.editReply({
								content: `Ok! I believe you would like to make it so that only people with ${perm} permissions can run commands in ${channel}. Is this correct?`,
								embeds: [],
								components: [confirmationRow],
							})

							interactionCollector.once('collect', async (i) => {
								if (i.customId === 'configYes') {
									const channels = (await (interaction.guild as RainGuild).database())?.guildSettings.lockedChannels as {
										owner: string[]
										admin: string[]
										srMod: string[]
										moderator: string[]
										helper: string[]
										trialHelper: string[]
									}

									if (await (message.channel as RainChannel).isLocked()) {
										const perms = await (message.channel as RainChannel).getRestrictedPerms()
										console.log(channels[perms as keyof typeof channels])
									}
								}
							})
						})
					})
					break
				}
				case 'configLogChannels': {
					const logTypesRow = new MessageActionRow().addComponents(
						new MessageButton({ customId: 'configLog|message', label: 'Message', style: 'PRIMARY' }),
						new MessageButton({ customId: 'configLog|member', label: 'Member', style: 'PRIMARY' }),
						new MessageButton({ customId: 'configLog|moderation', label: 'Moderation', style: 'PRIMARY' }),
						new MessageButton({ customId: 'configLog|action', label: 'Action', style: 'PRIMARY' })
					)

					await i.deferUpdate()
					await interaction.editReply({ content: 'ok what type of log channel do you want to set', embeds: [], components: [logTypesRow] })

					configLogInteractionCollector?.once('collect', async (i) => {
						const splitButton = i.customId.split('|')
						const logType = splitButton[1]

						await i.deferUpdate()
						await interaction.editReply({ content: `Ok! What channel would you like ${logType} logs to be in?`, embeds: [], components: [] })

						messageCollector?.once('collect', async (m) => {
							const channel = await this.client.util.resolveChannel(m.content, interaction.guild?.channels.cache as Collection<string, GuildTextBasedChannels | BaseGuildVoiceChannel>)
							if (channel?.isThread()) {
								await interaction.editReply({content: "You can't set my logging channels to be threads."})
							}
							const confirmationRow = new MessageActionRow().addComponents(
								new MessageButton({ customId: 'configYes', label: 'Yes', style: 'SUCCESS' }),
								new MessageButton({ customId: 'configNo', label: 'No', style: 'DANGER' })
							)

							await m.delete()
							await interaction.editReply({
								content: `Ok! I believe you would like to make it so that I log ${logType} in ${channel}. Is this correct?`,
								embeds: [],
								components: [confirmationRow],
							})

							interactionCollector.once('collect', async (i) => {
								if (i.customId === 'configYes') {
									const editedChannel = await (message.guild as RainGuild).setLogChannel(logType as 'message' | 'member' | 'moderation' | 'action', channel?.id as Snowflake)

									if (editedChannel === true) {
										await message.interaction.editReply({
											content: `I have succesfully made it so that ${logType} logs are logged in ${channel}.`,
											embeds: [],
											components: [],
										})
										return
									} else {
										await message.interaction.editReply({
											content: `I failed to add logs to ${channel}. This error has been automatically reported to my developer.`,
											embeds: [],
											components: [],
										})
										return
									}
								}
							})
						})
					})
					break
				}
				case 'configStaffRoles': {
					await i.deferUpdate()

					await interaction.editReply({
						content: 'What role would you like to set the permissions of?',
						embeds: [],
						components: [],
					})

					messageCollector.once('collect', async (m) => {
						const role = this.client.util.resolveRole(m.content, interaction.guild?.roles.cache as Collection<Snowflake, Role>)
						await m.delete()

						if (role === undefined) {
							await interaction.editReply({
								content: "I couldn't find that role.",
								embeds: [],
								components: [],
							})
						}

						const staffRoleRow1 = new MessageActionRow().addComponents(
							new MessageButton({ customId: 'configStaffRoles|owner', label: 'Owner', style: 'PRIMARY' }),
							new MessageButton({ customId: 'configStaffRoles|admin', label: 'Admin', style: 'PRIMARY' }),
							new MessageButton({ customId: 'configStaffRoles|srMod', label: 'Sr. Mod', style: 'PRIMARY' })
						)
						const staffRoleRow2 = new MessageActionRow().addComponents(
							new MessageButton({ customId: 'configStaffRoles|moderator', label: 'Moderator', style: 'PRIMARY' }),
							new MessageButton({ customId: 'configStaffRoles|helper', label: 'Helper', style: 'PRIMARY' }),
							new MessageButton({ customId: 'configStaffRoles|trialHelper', label: 'Trial Helper', style: 'PRIMARY' })
						)
						await interaction.editReply({
							content: `Alright! What perms would you like to give to ${role}?`,
							embeds: [],
							components: [staffRoleRow1, staffRoleRow2],
							allowedMentions: {},
						})

						staffRolesInteractionCollector.once('collect', async (i) => {
							await i.deferUpdate()

							const editedRole = await (interaction.guild as RainGuild).editStaffRole(i.customId.split('|')[1] as perms, role?.id as Snowflake)

							if (editedRole === true) {
								await interaction.editReply({
									content: `${role} has been given ${i.customId.split('|')[1]} perms.`,
									embeds: [],
									components: [],
									allowedMentions: {},
								})
							} else {
								await interaction.editReply({
									content: `I failed to give ${role} ${i.customId.split('|')[1]} perms. This error has been automatically reported to my developer.`,
									embeds: [],
									components: [],
									allowedMentions: {},
								})
							}
						})
					})

					break
				}
				case 'configMuteRole': {
					await interaction.editReply({ content: 'What role would you like to be the muted role?', embeds: [], components: [] })
					messageCollector.once('collect', async (msg: Message) => {
						await msg.delete()
						const role = await this.client.util.resolveRole(msg.content, msg.guild?.roles.cache as Collection<string, Role>)
						if (role === undefined) {
							await interaction.editReply({ content: "I couldn't find that role." })
							return
						}

						const edited = await database.editGuild(interaction.guildId as Snowflake, 'guildSettings.muteRole', role.id)
						if (edited === true) {
							await interaction.editReply({ content: `The muted role has succesfully been set to ${role}`, allowedMentions: { parse: [] } })
						} else await interaction.editReply({ content: `I failed to set the muted role to ${role}`, allowedMentions: { parse: [] } })
					})
					break
				}
				case 'configLockCommand': {
					await i.deferUpdate()
					await interaction.editReply({
						content: 'Which command would you like to set?',
						embeds: [],
						components: [
							{
								type: 1,
								components: [
									{
										type: 'BUTTON',
										label: 'All command IDs',
										style: 'PRIMARY',
										customId: 'showCommandIDs',
									},
								],
							},
						],
					})

					messageCollector.once('collect', async (m: Message) => {
						await m.delete()

						if (!Handler.getAllCommands().includes(m.content)) {
							await interaction.editReply({ content: "That ID isn't valid.", components: [] })
							return
						}

						const command = m.content

						await interaction.editReply({
							content: `Which permissions would you like ${command} to have?`,
							embeds: [],
							components: [
								{
									type: 1,
									components: [
										{
											type: 'BUTTON',
											label: 'All Permissions',
											style: 'PRIMARY',
											customId: 'showPermissions',
										},
									],
								},
							],
						})

						messageCollector.once('collect', async (m: Message) => {
							await m.delete()
							const permArray = [
								'owner',
								'admin',
								'srMod',
								'moderator',
								'helper',
								'trialHelper'
							]
							if (!permArray.includes(m.content)) {await interaction.editReply({content: "That isn't a valid permission!", components: []})}

							const perms = m.content as perms

							const edited = await (message.guild as RainGuild).setCommandPermissions(command, perms)

							await interaction.editReply({content: `${edited ? `I succesfully edited ${command} to only run if you have ${perms}.` : `I failed to edit ${command}.`}`, components: []})
						})
					})

					break
				}
			}
		})
	}
}
