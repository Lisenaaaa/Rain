import { ApplyOptions } from '@sapphire/decorators'
import { isGuildBasedChannel } from '@sapphire/discord.js-utilities'
import { GuildTextBasedChannelTypes } from '@sapphire/discord.js-utilities'
import { CommandOptions } from '@sapphire/framework'
import { ButtonInteraction, CommandInteraction, Guild, InteractionReplyOptions, Message, Snowflake, TextChannel } from 'discord.js'
import RainCommand from '../../structures/RainCommand'

@ApplyOptions<CommandOptions>({
	name: 'config',
	aliases: ['config'],
	description: 'configure the guild',
	preconditions: ['slashOnly', 'permissions', 'GuildOnly'],
	defaultPermissions: 'srMod',
	userDiscordPerms: ['MANAGE_GUILD'],
	botPerms: ['MANAGE_MESSAGES'],
	slashOptions: {
		guildIDs: ['880637463838724166'],
		idHints: ['928065482647535687'],
	},
})
export class ConfigCommand extends RainCommand {
	public override async chatInputRun(interaction: CommandInteraction) {
		if (interaction.channel === null) {
			return await interaction.reply('how did you even manage to run this not in a channel lol')
		}
		if (!isGuildBasedChannel(interaction.channel)) {
			return await interaction.reply({ content: 'This must be ran in a text channel.', ephemeral: true })
		}

		await interaction.reply({
			content: 'config',
			components: [
				{
					type: 'ACTION_ROW',
					components: [
						{
							type: 'BUTTON',
							label: 'welcome',
							style: 'PRIMARY',
							customId: 'configWelcome',
						},
						{
							type: 'BUTTON',
							label: 'logging',
							style: 'PRIMARY',
							customId: 'configLogging',
						},
					],
				},
			],
		})

		const { id } = await interaction.fetchReply()

		const button = await this.awaitButton(interaction.user.id, id, interaction.channel)

		if (button?.customId === 'configWelcome') {
			await button.deferUpdate()

			await interaction.editReply({
				content: 'What would you like to do with the welcoming system?',
				components: [
					{
						type: 'ACTION_ROW',
						components: [
							{ type: 'BUTTON', label: 'Set Welcome/Leave Channel', style: 'SUCCESS', customId: 'configSetWelcomeChannel' },
							{ type: 'BUTTON', label: 'Remove Welcome/Leave Channel', style: 'DANGER', customId: 'configRemoveWelcomeChannel' },
						],
					},
					{
						type: 'ACTION_ROW',
						components: [
							{ type: 'BUTTON', label: 'Set Welcome Message', style: 'SUCCESS', customId: 'configSetWelcomeMessage' },
							{ type: 'BUTTON', label: 'Remove Welcome Message', style: 'DANGER', customId: 'configRemoveWelcomeMessage' },
						],
					},
					{
						type: 'ACTION_ROW',
						components: [
							{ type: 'BUTTON', label: 'Set Leave Message', style: 'SUCCESS', customId: 'configSetLeaveMessage' },
							{ type: 'BUTTON', label: 'Remove Leave Message', style: 'DANGER', customId: 'configRemoveLeaveMessage' },
						],
					},
				],
			})

			const actionButton = await this.awaitButton(interaction.user.id, id, interaction.channel)

			await actionButton?.deferUpdate()

			switch (actionButton?.customId) {
				case 'configSetWelcomeChannel': {
					const msg = await this.promptMessage(interaction, { content: 'Please mention the channel that you would like to change the new welcome channel to.', components: [] })
					if (!msg) {
						return await interaction.editReply("I can't get a channel from nothing!")
					}

					await msg.delete()

					const channel = this.container.guilds.findChannel(interaction.guild as Guild, msg.content)
					if (!channel) {
						return await interaction.editReply({ content: "I couldn't find that channel." })
					}

					await interaction.editReply({
						content: `Are you sure you want to set the welcome channel to **${channel.toString()}**?`,
						components: [
							{
								type: 'ACTION_ROW',
								components: [
									{ type: 'BUTTON', style: 'SUCCESS', label: 'Yes', customId: 'configSetWelcomeChannelYes' },
									{ type: 'BUTTON', style: 'DANGER', label: 'No', customId: 'configSetWelcomeChannelNo' },
								],
							},
						],
					})

					const confirmationButton = await this.awaitButton(interaction.user.id, id, interaction.channel)

					if (confirmationButton?.customId === 'configSetWelcomeChannelYes') {
						await this.container.database.guilds.update({ welcomeChannel: channel.id }, { where: { id: interaction.guildId as string } })

						return await interaction.editReply({ content: `Succesfully set this guild's welcome channel to **${channel.toString()}**.`, components: [] })
					}
					if (confirmationButton?.customId === 'configSetWelcomeChannelNo') {
						return await interaction.editReply({ content: "Alright! I haven't made any changes.", components: [] })
					}

					break
				}
				case 'configRemoveWelcomeChannel': {
					await interaction.editReply({
						content: `Are you sure you want to remove this guild's welcome channel, disabling both the join and leave messages?`,
						components: [
							{
								type: 'ACTION_ROW',
								components: [
									{ type: 'BUTTON', style: 'SUCCESS', label: 'Yes', customId: 'configRemoveWelcomeChannelYes' },
									{ type: 'BUTTON', style: 'DANGER', label: 'No', customId: 'configRemoveWelcomeChannelNo' },
								],
							},
						],
					})

					const confirmationButton = await this.awaitButton(interaction.user.id, id, interaction.channel)

					if (confirmationButton?.customId === 'configRemoveWelcomeChannelYes') {
						await this.container.database.guilds.update({ welcomeChannel: null }, { where: { id: interaction.guildId as string } })

						return await interaction.editReply({ content: `Succesfully removed this guild's welcome channel.`, components: [] })
					}
					if (confirmationButton?.customId === 'configRemoveWelcomeChannelNo') {
						return await interaction.editReply({ content: "Alright! I haven't made any changes.", components: [] })
					}
					break
				}

				case 'configSetWelcomeMessage': {
					const msg = await this.promptMessage(interaction, {
						content: 'What would you like the welcome message to be?',
						components: [
							{
								type: 'ACTION_ROW',
								components: [{ type: 'BUTTON', style: 'LINK', url: 'https://skyblock-plus-logs.vercel.app/logs?url=https://hst.sh/raw/idejupicax', label: 'View Args' }],
							},
						],
					})
					if (!msg) {
						return await interaction.editReply("I can't get a welcome message from nothing!")
					}

					await msg.delete()

					// const channel = this.container.guilds.findChannel(interaction.guild as Guild, msg.content)
					// if (!channel) {
					// 	return await interaction.editReply({ content: "I couldn't find that channel." })
					// }

					await interaction.editReply({
						content: `Are you sure you want to set the welcome message to ${msg.content}?`,
						components: [
							{
								type: 'ACTION_ROW',
								components: [
									{ type: 'BUTTON', style: 'SUCCESS', label: 'Yes', customId: 'configSetWelcomeMessageYes' },
									{ type: 'BUTTON', style: 'DANGER', label: 'No', customId: 'configSetWelcomeMessageNo' },
								],
							},
						],
					})

					const confirmationButton = await this.awaitButton(interaction.user.id, id, interaction.channel)

					if (confirmationButton?.customId === 'configSetWelcomeMessageYes') {
						await this.container.database.guilds.update({ welcomeMessage: msg.content }, { where: { id: interaction.guildId as string } })

						return await interaction.editReply({ content: `Succesfully set this guild's welcome message to ${msg.content}.`, components: [] })
					}
					if (confirmationButton?.customId === 'configSetWelcomeMessageNo') {
						return await interaction.editReply({ content: "Alright! I haven't made any changes.", components: [] })
					}

					break
				}
				case 'configRemoveWelcomeMessage': {
					await interaction.editReply({
						content: `Are you sure you want to remove this guild's welcome message, disabling the join messages?`,
						components: [
							{
								type: 'ACTION_ROW',
								components: [
									{ type: 'BUTTON', style: 'SUCCESS', label: 'Yes', customId: 'configRemoveWelcomeMessageYes' },
									{ type: 'BUTTON', style: 'DANGER', label: 'No', customId: 'configRemoveWelcomeMessageNo' },
								],
							},
						],
					})

					const confirmationButton = await this.awaitButton(interaction.user.id, id, interaction.channel)

					if (confirmationButton?.customId === 'configRemoveWelcomeMessageYes') {
						await this.container.database.guilds.update({ welcomeMessage: null }, { where: { id: interaction.guildId as string } })

						return await interaction.editReply({ content: `Succesfully removed this guild's welcome message.`, components: [] })
					}
					if (confirmationButton?.customId === 'configRemoveWelcomeMessageNo') {
						return await interaction.editReply({ content: "Alright! I haven't made any changes.", components: [] })
					}
					break
				}

				case 'configSetLeaveMessage': {
					await interaction.editReply({ content: `set leave message`, components: [] })
					break
				}
				case 'configRemoveLeaveMessage': {
					await interaction.editReply({
						content: `Are you sure you want to remove this guild's leave message, disabling the leave messages?`,
						components: [
							{
								type: 'ACTION_ROW',
								components: [
									{ type: 'BUTTON', style: 'SUCCESS', label: 'Yes', customId: 'configRemoveLeaveMessageYes' },
									{ type: 'BUTTON', style: 'DANGER', label: 'No', customId: 'configRemoveLeaveMessageNo' },
								],
							},
						],
					})

					const confirmationButton = await this.awaitButton(interaction.user.id, id, interaction.channel)

					if (confirmationButton?.customId === 'configRemoveLeaveMessageYes') {
						await this.container.database.guilds.update({ leaveMessage: null }, { where: { id: interaction.guildId as string } })

						return await interaction.editReply({ content: `Succesfully removed this guild's leave message.`, components: [] })
					}
					if (confirmationButton?.customId === 'configRemoveLeaveMessageNo') {
						return await interaction.editReply({ content: "Alright! I haven't made any changes.", components: [] })
					}
					break
				}
			}
		}

		if (button?.customId === 'configLogging') {
			await button.deferUpdate()

			await interaction.editReply({
				content: 'What would you like to do with the logging system?',
				components: [
					{
						type: 'ACTION_ROW',
						components: [
							{ type: 'BUTTON', label: 'Set Message Logging Channel', style: 'SUCCESS', customId: 'configSetMessageLogChannel' },
							{ type: 'BUTTON', label: 'Remove Message Logging Channel', style: 'DANGER', customId: 'configRemoveMessageLogChannel' },
						],
					},
					{
						type: 'ACTION_ROW',
						components: [
							{ type: 'BUTTON', label: 'Set Member Logging Channel', style: 'SUCCESS', customId: 'configSetMemberLogChannel' },
							{ type: 'BUTTON', label: 'Remove Member Logging Channel', style: 'DANGER', customId: 'configRemoveMemberLogChannel' },
						],
					},
					{
						type: 'ACTION_ROW',
						components: [
							{ type: 'BUTTON', label: 'Set Action Logging Channel', style: 'SUCCESS', customId: 'configSetActionLogChannel' },
							{ type: 'BUTTON', label: 'Remove Action Logging Channel', style: 'DANGER', customId: 'configRemoveActionLogChannel' },
						],
					},
					{
						type: 'ACTION_ROW',
						components: [
							{ type: 'BUTTON', label: 'Set Moderation Logging Channel', style: 'SUCCESS', customId: 'configSetModerationLogChannel' },
							{ type: 'BUTTON', label: 'Remove Moderation Logging Channel', style: 'DANGER', customId: 'configRemoveModerationLogChannel' },
						],
					},
				],
			})

			const actionButton = await this.awaitButton(interaction.user.id, id, interaction.channel)

			await actionButton?.deferUpdate()

			switch (actionButton?.customId) {
				case 'configSetMessageLogChannel': {
					const channelType = 'message logging'
					const buttonChannelType = 'MessageLogging'
					const msg = await this.promptMessage(interaction, { content: `Please mention the channel that you would like to change the ${channelType} channel to.`, components: [] })
					if (!msg) {
						return await interaction.editReply("I can't get a channel from nothing!")
					}

					await msg.delete()

					const channel = this.container.guilds.findChannel(interaction.guild as Guild, msg.content)
					if (!channel) {
						return await interaction.editReply({ content: "I couldn't find that channel." })
					}

					await interaction.editReply({
						content: `Are you sure you want to set the ${channelType} channel to **${channel.toString()}**?`,
						components: [
							{
								type: 'ACTION_ROW',
								components: [
									{ type: 'BUTTON', style: 'SUCCESS', label: 'Yes', customId: `configSet${buttonChannelType}ChannelYes` },
									{ type: 'BUTTON', style: 'DANGER', label: 'No', customId: `configSet${buttonChannelType}ChannelNo` },
								],
							},
						],
					})

					const confirmationButton = await this.awaitButton(interaction.user.id, id, interaction.channel)

					if (confirmationButton?.customId === `configSet${buttonChannelType}ChannelYes`) {
						await this.container.database.guilds.update({ messageLoggingChannel: channel.id }, { where: { id: interaction.guildId as string } })

						return await interaction.editReply({ content: `Succesfully set this guild's ${channelType} channel to **${channel.toString()}**.`, components: [] })
					}
					if (confirmationButton?.customId === `configSet${buttonChannelType}ChannelNo`) {
						return await interaction.editReply({ content: "Alright! I haven't made any changes.", components: [] })
					}

					break
				}
				case 'configRemoveMessageLogChannel': {
					const channelType = 'message logging'
					const buttonChannelType = 'MessageLogging'

					await interaction.editReply({
						content: `Are you sure you want to remove this guild's ${channelType} channel?`,
						components: [
							{
								type: 'ACTION_ROW',
								components: [
									{ type: 'BUTTON', style: 'SUCCESS', label: 'Yes', customId: `configRemove${buttonChannelType}Yes` },
									{ type: 'BUTTON', style: 'DANGER', label: 'No', customId: `configRemove${buttonChannelType}No` },
								],
							},
						],
					})

					const confirmationButton = await this.awaitButton(interaction.user.id, id, interaction.channel)

					if (confirmationButton?.customId === `configRemove${buttonChannelType}Yes`) {
						await this.container.database.guilds.update({ messageLoggingChannel: null }, { where: { id: interaction.guildId as string } })

						return await interaction.editReply({ content: `Succesfully removed this guild's ${channelType} channel.`, components: [] })
					}
					if (confirmationButton?.customId === `configRemove${buttonChannelType}No`) {
						return await interaction.editReply({ content: "Alright! I haven't made any changes.", components: [] })
					}
					break
				}

				case 'configSetMemberLogChannel': {
					const channelType = 'member logging'
					const buttonChannelType = 'MemberLogging'
					const msg = await this.promptMessage(interaction, { content: `Please mention the channel that you would like to change the ${channelType} channel to.`, components: [] })
					if (!msg) {
						return await interaction.editReply("I can't get a channel from nothing!")
					}

					await msg.delete()

					const channel = this.container.guilds.findChannel(interaction.guild as Guild, msg.content)
					if (!channel) {
						return await interaction.editReply({ content: "I couldn't find that channel." })
					}

					await interaction.editReply({
						content: `Are you sure you want to set the ${channelType} channel to **${channel.toString()}**?`,
						components: [
							{
								type: 'ACTION_ROW',
								components: [
									{ type: 'BUTTON', style: 'SUCCESS', label: 'Yes', customId: `configSet${buttonChannelType}ChannelYes` },
									{ type: 'BUTTON', style: 'DANGER', label: 'No', customId: `configSet${buttonChannelType}ChannelNo` },
								],
							},
						],
					})

					const confirmationButton = await this.awaitButton(interaction.user.id, id, interaction.channel)

					if (confirmationButton?.customId === `configSet${buttonChannelType}ChannelYes`) {
						await this.container.database.guilds.update({ memberLoggingChannel: channel.id }, { where: { id: interaction.guildId as string } })

						return await interaction.editReply({ content: `Succesfully set this guild's ${channelType} channel to **${channel.toString()}**.`, components: [] })
					}
					if (confirmationButton?.customId === `configSet${buttonChannelType}ChannelNo`) {
						return await interaction.editReply({ content: "Alright! I haven't made any changes.", components: [] })
					}

					break
				}
				case 'configRemoveMemberLogChannel': {
					const channelType = 'member logging'
					const buttonChannelType = 'MemberLogging'

					await interaction.editReply({
						content: `Are you sure you want to remove this guild's ${channelType} channel?`,
						components: [
							{
								type: 'ACTION_ROW',
								components: [
									{ type: 'BUTTON', style: 'SUCCESS', label: 'Yes', customId: `configRemove${buttonChannelType}Yes` },
									{ type: 'BUTTON', style: 'DANGER', label: 'No', customId: `configRemove${buttonChannelType}No` },
								],
							},
						],
					})

					const confirmationButton = await this.awaitButton(interaction.user.id, id, interaction.channel)

					if (confirmationButton?.customId === `configRemove${buttonChannelType}Yes`) {
						await this.container.database.guilds.update({ memberLoggingChannel: null }, { where: { id: interaction.guildId as string } })

						return await interaction.editReply({ content: `Succesfully removed this guild's ${channelType} channel.`, components: [] })
					}
					if (confirmationButton?.customId === `configRemove${buttonChannelType}No`) {
						return await interaction.editReply({ content: "Alright! I haven't made any changes.", components: [] })
					}
					break
				}

				case 'configSetActionLogChannel': {
					const channelType = 'action logging'
					const buttonChannelType = 'ActionLogging'
					const msg = await this.promptMessage(interaction, { content: `Please mention the channel that you would like to change the ${channelType} channel to.`, components: [] })
					if (!msg) {
						return await interaction.editReply("I can't get a channel from nothing!")
					}

					await msg.delete()

					const channel = this.container.guilds.findChannel(interaction.guild as Guild, msg.content)
					if (!channel) {
						return await interaction.editReply({ content: "I couldn't find that channel." })
					}

					await interaction.editReply({
						content: `Are you sure you want to set the ${channelType} channel to **${channel.toString()}**?`,
						components: [
							{
								type: 'ACTION_ROW',
								components: [
									{ type: 'BUTTON', style: 'SUCCESS', label: 'Yes', customId: `configSet${buttonChannelType}ChannelYes` },
									{ type: 'BUTTON', style: 'DANGER', label: 'No', customId: `configSet${buttonChannelType}ChannelNo` },
								],
							},
						],
					})

					const confirmationButton = await this.awaitButton(interaction.user.id, id, interaction.channel)

					if (confirmationButton?.customId === `configSet${buttonChannelType}ChannelYes`) {
						await this.container.database.guilds.update({ actionLoggingChannel: channel.id }, { where: { id: interaction.guildId as string } })

						return await interaction.editReply({ content: `Succesfully set this guild's ${channelType} channel to **${channel.toString()}**.`, components: [] })
					}
					if (confirmationButton?.customId === `configSet${buttonChannelType}ChannelNo`) {
						return await interaction.editReply({ content: "Alright! I haven't made any changes.", components: [] })
					}

					break
				}
				case 'configRemoveActionLogChannel': {
					const channelType = 'action logging'
					const buttonChannelType = 'ActionLogging'

					await interaction.editReply({
						content: `Are you sure you want to remove this guild's ${channelType} channel?`,
						components: [
							{
								type: 'ACTION_ROW',
								components: [
									{ type: 'BUTTON', style: 'SUCCESS', label: 'Yes', customId: `configRemove${buttonChannelType}Yes` },
									{ type: 'BUTTON', style: 'DANGER', label: 'No', customId: `configRemove${buttonChannelType}No` },
								],
							},
						],
					})

					const confirmationButton = await this.awaitButton(interaction.user.id, id, interaction.channel)

					if (confirmationButton?.customId === `configRemove${buttonChannelType}Yes`) {
						await this.container.database.guilds.update({ actionLoggingChannel: null }, { where: { id: interaction.guildId as string } })

						return await interaction.editReply({ content: `Succesfully removed this guild's ${channelType} channel.`, components: [] })
					}
					if (confirmationButton?.customId === `configRemove${buttonChannelType}No`) {
						return await interaction.editReply({ content: "Alright! I haven't made any changes.", components: [] })
					}
					break
				}

				case 'configSetModerationLogChannel': {
					const channelType = 'moderation logging'
					const buttonChannelType = 'ModerationLogging'
					const msg = await this.promptMessage(interaction, { content: `Please mention the channel that you would like to change the ${channelType} channel to.`, components: [] })
					if (!msg) {
						return await interaction.editReply("I can't get a channel from nothing!")
					}

					await msg.delete()

					const channel = this.container.guilds.findChannel(interaction.guild as Guild, msg.content)
					if (!channel) {
						return await interaction.editReply({ content: "I couldn't find that channel." })
					}

					await interaction.editReply({
						content: `Are you sure you want to set the ${channelType} channel to **${channel.toString()}**?`,
						components: [
							{
								type: 'ACTION_ROW',
								components: [
									{ type: 'BUTTON', style: 'SUCCESS', label: 'Yes', customId: `configSet${buttonChannelType}ChannelYes` },
									{ type: 'BUTTON', style: 'DANGER', label: 'No', customId: `configSet${buttonChannelType}ChannelNo` },
								],
							},
						],
					})

					const confirmationButton = await this.awaitButton(interaction.user.id, id, interaction.channel)

					if (confirmationButton?.customId === `configSet${buttonChannelType}ChannelYes`) {
						await this.container.database.guilds.update({ moderationLoggingChannel: channel.id }, { where: { id: interaction.guildId as string } })

						return await interaction.editReply({ content: `Succesfully set this guild's ${channelType} channel to **${channel.toString()}**.`, components: [] })
					}
					if (confirmationButton?.customId === `configSet${buttonChannelType}ChannelNo`) {
						return await interaction.editReply({ content: "Alright! I haven't made any changes.", components: [] })
					}

					break
				}
				case 'configRemoveModerationLogChannel': {
					const channelType = 'moderation logging'
					const buttonChannelType = 'ModerationLogging'

					await interaction.editReply({
						content: `Are you sure you want to remove this guild's ${channelType} channel?`,
						components: [
							{
								type: 'ACTION_ROW',
								components: [
									{ type: 'BUTTON', style: 'SUCCESS', label: 'Yes', customId: `configRemove${buttonChannelType}Yes` },
									{ type: 'BUTTON', style: 'DANGER', label: 'No', customId: `configRemove${buttonChannelType}No` },
								],
							},
						],
					})

					const confirmationButton = await this.awaitButton(interaction.user.id, id, interaction.channel)

					if (confirmationButton?.customId === `configRemove${buttonChannelType}Yes`) {
						await this.container.database.guilds.update({ moderationLoggingChannel: null }, { where: { id: interaction.guildId as string } })

						return await interaction.editReply({ content: `Succesfully removed this guild's ${channelType} channel.`, components: [] })
					}
					if (confirmationButton?.customId === `configRemove${buttonChannelType}No`) {
						return await interaction.editReply({ content: "Alright! I haven't made any changes.", components: [] })
					}
					break
				}
			}
		}
	}

	private getTimeInSeconds(t: number) {
		return t * 1000
	}

	private async promptMessage(interaction: CommandInteraction, options: InteractionReplyOptions): Promise<Message | undefined> {
		const filter = (m: Message) => m.author.id === interaction.user.id
		if (interaction.replied) {
			await interaction.editReply(options)
		} else {
			await interaction.reply(options)
		}

		const message = await (interaction.channel as TextChannel).awaitMessages({ filter, time: this.getTimeInSeconds(60), max: 1, errors: ['time'] })
		return message.first()
	}

	private async awaitButton(userId: Snowflake, messageId: Snowflake, channel: GuildTextBasedChannelTypes): Promise<ButtonInteraction | undefined> {
		return await channel.awaitMessageComponent({
			componentType: 'BUTTON',
			filter: (b: ButtonInteraction<'cached'>) => b.user.id === userId && b.message.id === messageId,
			time: this.getTimeInSeconds(60),
		})
	}
}
