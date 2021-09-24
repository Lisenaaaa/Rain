import { RainCommand } from '@extensions/RainCommand'
import utils from '@functions/utils'
import { AkairoMessage, GuildTextBasedChannels } from 'discord-akairo'
import { BaseGuildVoiceChannel, ButtonInteraction, Collection, Interaction, InteractionReplyOptions, Message, MessageActionRow, MessageButton } from 'discord.js'
import { RainGuild } from '@extensions/discord.js/Guild'
import { perms } from '@src/types/misc'
import { RainMessage } from '@extensions/discord.js/Message'

export default class config extends RainCommand {
	constructor() {
		super('config', {
			aliases: ['config'],
			description: 'configure the bot',
			usage: '-config',
			discordPerms: ['MANAGE_GUILD'],

			slash: true,
			slashGuilds: utils.slashGuilds,
		})
	}

	async exec(message: RainMessage) {
		await message.reply('use this as a slashcommand')
	}

	async execSlash(message: AkairoMessage) {
		if (!message.guild) return await message.reply({ content: "This won't work if it isn't on a server!", ephemeral: true } as InteractionReplyOptions)

		const filter = (i: Interaction) => i.user.id == message.author.id
		const filterMsg = (m: Message) => m.author.id == message.author.id

		//@ts-ignore this is only used for a button, and those have the customId property. this will work fine.
		const filterRestrictChannels = (i: Interaction) => i.user.id === message.author.id && i.customId.startsWith('configRestrictChannels')

		const interactionCollector = await message.channel?.createMessageComponentCollector({ filter, time: 60000 })
		const configRestrictChannelsInteractionCollector = await message.channel?.createMessageComponentCollector({ filter: filterRestrictChannels, time: 60000 })
		const messageCollector = await message.channel?.createMessageCollector({ filter: filterMsg, time: 60000 })

		const OptionsRow = new MessageActionRow().addComponents(
			new MessageButton({ customId: 'configRestrictChannels', label: 'Restrict Channels', style: 'PRIMARY' }),
			new MessageButton({ customId: 'configLogChannels', label: 'Logging Channels', style: 'PRIMARY' }),
			new MessageButton({ customId: 'configStaffRoles', label: 'Set Staff Roles', style: 'PRIMARY' })
		)

		await message.reply({
			embeds: [{ title: `${message.guild.name}'s config`, description: `configure the bot\neach prompt/button has a 60 second time before it will stop listening for responses` }],
			components: [OptionsRow],
		})

		interactionCollector?.once('collect', async (i) => {
			switch (i.customId) {
				case 'configRestrictChannels':
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
							await message.interaction.editReply({
								content: `Ok! I believe you would like to make it so that only people with ${perm} permissions can run commands in ${channel}. Is this correct?`,
								embeds: [],
								components: [confirmationRow],
							})

							interactionCollector.once('collect', async (i) => {
								if (i.customId === 'configYes') {
									const editedChannel = await (message.guild as RainGuild).restrictChannel(channel.id, perm as perms)

									if (editedChannel === true) {
										await message.interaction.editReply({
											content: `I have succesfully made it so that only people with ${perm} can run commands in ${channel}.\nSome slashcommands will still work, they'll just be ephemeral.`,
											embeds: [],
											components: [],
										})
										return
									} else {
										await message.interaction.editReply({
											content: `I failed to restrict ${channel}. This error has been automatically reported to my developer.`,
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
		})
	}
}
