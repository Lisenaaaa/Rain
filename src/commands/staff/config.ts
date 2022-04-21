import { ApplyOptions } from '@sapphire/decorators'
import { isGuildBasedChannel } from '@sapphire/discord.js-utilities'
import { CommandOptions } from '@sapphire/framework'
import { ButtonStyle, ComponentType } from 'discord-api-types'
import { CommandInteraction, MessageActionRow, MessageButton, TextChannel } from 'discord.js'
import got from 'got/dist/source'
import { GuildDatabase } from '../../functions/databases/guild'
import RainCommand from '../../structures/RainCommand'
import { PermNames, Perms } from '../../types/misc'

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
		options: [
			{
				name: 'action',
				type: 'STRING',
				description: 'the config option you want to choose',
				required: false,
				choices: [
					{ name: 'Welcome', value: 'configWelcome' },
					{ name: 'Logging', value: 'configLogging' },
					{ name: 'Staff Roles', value: 'configStaffRoles' },
					{ name: 'Mute Role', value: 'configMuteRole' },
					{ name: 'Restricted Channels', value: 'configRestrictedChannels' },
					// { name: 'After Punishment Message', value: 'configAfterPunishMessage' },
					{ name: 'View Config', value: 'configView' },
				],
			},
		],
	},
})
export class ConfigCommand extends RainCommand {
	public override async chatInputRun(interaction: CommandInteraction) {
		let { action }: { action?: string } = this.parseArgs(interaction)
		if (interaction.channel === null) {
			return await interaction.reply({
				content: 'how did you even manage to run this not in a channel, and could you please tell my dev about this? discord.gg/jWUNaGgxnB',
			})
		}

		if (interaction.guild === null || interaction.guildId === null) {
			return await interaction.reply({ content: 'This must be ran in a text channel on a server.', ephemeral: true })
		}

		if (!this.container.utils.isMember(interaction.member)) {
			return await interaction.reply({ content: 'ok HOW did you manage to run this on a guild without being a member of that guild?????' })
		}

		if (!isGuildBasedChannel(interaction.channel)) {
			return await interaction.reply({ content: 'This must be ran in a text channel on a server.', ephemeral: true })
		}

		if ((await this.container.database.guilds.findByPk(interaction.guild.id)) === null) {
			await this.container.database.guilds.create({ id: interaction.guild.id })
		}

		await interaction.deferReply()

		const { id } = await interaction.fetchReply()

		let apId = interaction.id
		let apToken = interaction.token

		if (!action) {
			await interaction.editReply({
				content: 'Select an option from the menu below:',
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
							{
								type: 'BUTTON',
								label: 'staff roles',
								style: 'PRIMARY',
								customId: 'configStaffRoles',
							},
							{
								type: 'BUTTON',
								label: 'mute role',
								style: 'PRIMARY',
								customId: 'configMuteRole',
							},
							{
								type: 'BUTTON',
								label: 'restricted channels',
								style: 'PRIMARY',
								customId: 'configRestrictedChannels',
							},
						],
					},
					{
						type: 'ACTION_ROW',
						components: [
							{
								type: 'BUTTON',
								label: 'after punishment message',
								style: 'PRIMARY',
								customId: 'configAfterPunishMessage',
							},
						],
					},
					{
						type: 'ACTION_ROW',
						components: [
							{
								type: 'BUTTON',
								label: 'View Config',
								style: 'SUCCESS',
								customId: 'configView',
							},
						],
					},
				],
			})

			const button = await this.container.utils.awaitButton(interaction.user.id, id, interaction.channel)

			if (!button) {
				return await interaction.editReply({ content: "You've ran out of time.", components: [] })
			}

			if (button.customId !== 'configAfterPunishMessage') {
				await button.deferUpdate()
			}

			action = button.customId

			apId = button.id
			apToken = button.token
		}

		if (action === 'configWelcome') {
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

			const actionButton = await this.container.utils.awaitButton(interaction.user.id, id, interaction.channel)

			await actionButton?.deferUpdate()

			switch (actionButton?.customId) {
				case 'configSetWelcomeChannel': {
					const msg = await this.container.utils.promptMessage(interaction, {
						content: 'Please mention the channel that you would like to change the new welcome channel to.',
						components: [],
					})
					if (!msg) {
						return await interaction.editReply("I can't get a channel from nothing!")
					}

					console.log('deleting message')
					await msg.delete()

					const channel = this.container.guilds.findChannel(interaction.guild, msg.content)
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

					const confirmationButton = await this.container.utils.awaitButton(interaction.user.id, id, interaction.channel)

					if (confirmationButton?.customId === 'configSetWelcomeChannelYes') {
						await this.container.database.guilds.update({ welcomeChannel: channel.id }, { where: { id: interaction.guildId } })

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

					const confirmationButton = await this.container.utils.awaitButton(interaction.user.id, id, interaction.channel)

					if (confirmationButton?.customId === 'configRemoveWelcomeChannelYes') {
						await this.container.database.guilds.update({ welcomeChannel: null }, { where: { id: interaction.guildId } })

						return await interaction.editReply({ content: `Succesfully removed this guild's welcome channel.`, components: [] })
					}
					if (confirmationButton?.customId === 'configRemoveWelcomeChannelNo') {
						return await interaction.editReply({ content: "Alright! I haven't made any changes.", components: [] })
					}
					break
				}

				case 'configSetWelcomeMessage': {
					const msg = await this.container.utils.promptMessage(interaction, {
						content: 'What would you like the welcome message to be?',
						components: [
							{
								type: 'ACTION_ROW',
								components: [{ type: 'BUTTON', style: 'LINK', url: this.container.constants.WelcomeLeaveVarsLink, label: 'View Args' }],
							},
						],
					})
					if (!msg) {
						return await interaction.editReply({ content: "I can't get a welcome message from nothing!", components: [] })
					}

					await msg.delete()

					// const channel = this.container.guilds.findChannel(interaction.guild, msg.content)
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

					const confirmationButton = await this.container.utils.awaitButton(interaction.user.id, id, interaction.channel)

					if (confirmationButton?.customId === 'configSetWelcomeMessageYes') {
						await this.container.database.guilds.update({ welcomeMessage: msg.content }, { where: { id: interaction.guildId } })

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

					const confirmationButton = await this.container.utils.awaitButton(interaction.user.id, id, interaction.channel)

					if (confirmationButton?.customId === 'configRemoveWelcomeMessageYes') {
						await this.container.database.guilds.update({ welcomeMessage: null }, { where: { id: interaction.guildId } })

						return await interaction.editReply({ content: `Succesfully removed this guild's welcome message.`, components: [] })
					}
					if (confirmationButton?.customId === 'configRemoveWelcomeMessageNo') {
						return await interaction.editReply({ content: "Alright! I haven't made any changes.", components: [] })
					}
					break
				}

				case 'configSetLeaveMessage': {
					const msg = await this.container.utils.promptMessage(interaction, {
						content: 'What would you like the leave message to be?',
						components: [
							{
								type: 'ACTION_ROW',
								components: [{ type: 'BUTTON', style: 'LINK', url: this.container.constants.WelcomeLeaveVarsLink, label: 'View Args' }],
							},
						],
					})
					if (!msg) {
						return await interaction.editReply({ content: "I can't get a goodbye message from nothing!", components: [] })
					}

					await msg.delete()

					// const channel = this.container.guilds.findChannel(interaction.guild, msg.content)
					// if (!channel) {
					// 	return await interaction.editReply({ content: "I couldn't find that channel." })
					// }

					await interaction.editReply({
						content: `Are you sure you want to set the goodbye message to ${msg.content}?`,
						components: [
							{
								type: 'ACTION_ROW',
								components: [
									{ type: 'BUTTON', style: 'SUCCESS', label: 'Yes', customId: 'configSetLeaveMessageYes' },
									{ type: 'BUTTON', style: 'DANGER', label: 'No', customId: 'configSetLeaveMessageNo' },
								],
							},
						],
					})

					const confirmationButton = await this.container.utils.awaitButton(interaction.user.id, id, interaction.channel)

					if (confirmationButton?.customId === 'configSetLeaveMessageYes') {
						await this.container.database.guilds.update({ leaveMessage: msg.content }, { where: { id: interaction.guildId } })

						return await interaction.editReply({ content: `Succesfully set this guild's welcome message to ${msg.content}.`, components: [] })
					}
					if (confirmationButton?.customId === 'configSetLeaveMessageNo') {
						return await interaction.editReply({ content: "Alright! I haven't made any changes.", components: [] })
					}

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

					const confirmationButton = await this.container.utils.awaitButton(interaction.user.id, id, interaction.channel)

					if (confirmationButton?.customId === 'configRemoveLeaveMessageYes') {
						await this.container.database.guilds.update({ leaveMessage: null }, { where: { id: interaction.guildId } })

						return await interaction.editReply({ content: `Succesfully removed this guild's leave message.`, components: [] })
					}
					if (confirmationButton?.customId === 'configRemoveLeaveMessageNo') {
						return await interaction.editReply({ content: "Alright! I haven't made any changes.", components: [] })
					}
					break
				}
			}
		}

		if (action === 'configLogging') {
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

			const actionButton = await this.container.utils.awaitButton(interaction.user.id, id, interaction.channel)

			await actionButton?.deferUpdate()

			switch (actionButton?.customId) {
				case 'configSetMessageLogChannel': {
					const channelType = 'message logging'
					const buttonChannelType = 'MessageLogging'
					const msg = await this.container.utils.promptMessage(interaction, {
						content: `Please mention the channel that you would like to change the ${channelType} channel to.`,
						components: [],
					})
					if (!msg) {
						return await interaction.editReply("I can't get a channel from nothing!")
					}

					await msg.delete()

					const channel = this.container.guilds.findChannel(interaction.guild, msg.content)
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

					const confirmationButton = await this.container.utils.awaitButton(interaction.user.id, id, interaction.channel)

					if (confirmationButton?.customId === `configSet${buttonChannelType}ChannelYes`) {
						await this.container.database.guilds.update({ messageLoggingChannel: channel.id }, { where: { id: interaction.guildId } })

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

					const confirmationButton = await this.container.utils.awaitButton(interaction.user.id, id, interaction.channel)

					if (confirmationButton?.customId === `configRemove${buttonChannelType}Yes`) {
						await this.container.database.guilds.update({ messageLoggingChannel: null }, { where: { id: interaction.guildId } })

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
					const msg = await this.container.utils.promptMessage(interaction, {
						content: `Please mention the channel that you would like to change the ${channelType} channel to.`,
						components: [],
					})
					if (!msg) {
						return await interaction.editReply("I can't get a channel from nothing!")
					}

					await msg.delete()

					const channel = this.container.guilds.findChannel(interaction.guild, msg.content)
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

					const confirmationButton = await this.container.utils.awaitButton(interaction.user.id, id, interaction.channel)

					if (confirmationButton?.customId === `configSet${buttonChannelType}ChannelYes`) {
						await this.container.database.guilds.update({ memberLoggingChannel: channel.id }, { where: { id: interaction.guildId } })

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

					const confirmationButton = await this.container.utils.awaitButton(interaction.user.id, id, interaction.channel)

					if (confirmationButton?.customId === `configRemove${buttonChannelType}Yes`) {
						await this.container.database.guilds.update({ memberLoggingChannel: null }, { where: { id: interaction.guildId } })

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
					const msg = await this.container.utils.promptMessage(interaction, {
						content: `Please mention the channel that you would like to change the ${channelType} channel to.`,
						components: [],
					})
					if (!msg) {
						return await interaction.editReply("I can't get a channel from nothing!")
					}

					await msg.delete()

					const channel = this.container.guilds.findChannel(interaction.guild, msg.content)
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

					const confirmationButton = await this.container.utils.awaitButton(interaction.user.id, id, interaction.channel)

					if (confirmationButton?.customId === `configSet${buttonChannelType}ChannelYes`) {
						await this.container.database.guilds.update({ actionLoggingChannel: channel.id }, { where: { id: interaction.guildId } })

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

					const confirmationButton = await this.container.utils.awaitButton(interaction.user.id, id, interaction.channel)

					if (confirmationButton?.customId === `configRemove${buttonChannelType}Yes`) {
						await this.container.database.guilds.update({ actionLoggingChannel: null }, { where: { id: interaction.guildId } })

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
					const msg = await this.container.utils.promptMessage(interaction, {
						content: `Please mention the channel that you would like to change the ${channelType} channel to.`,
						components: [],
					})
					if (!msg) {
						return await interaction.editReply("I can't get a channel from nothing!")
					}

					await msg.delete()

					const channel = this.container.guilds.findChannel(interaction.guild, msg.content)
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

					const confirmationButton = await this.container.utils.awaitButton(interaction.user.id, id, interaction.channel)

					if (confirmationButton?.customId === `configSet${buttonChannelType}ChannelYes`) {
						await this.container.database.guilds.update({ moderationLoggingChannel: channel.id }, { where: { id: interaction.guildId } })

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

					const confirmationButton = await this.container.utils.awaitButton(interaction.user.id, id, interaction.channel)

					if (confirmationButton?.customId === `configRemove${buttonChannelType}Yes`) {
						await this.container.database.guilds.update({ moderationLoggingChannel: null }, { where: { id: interaction.guildId } })

						return await interaction.editReply({ content: `Succesfully removed this guild's ${channelType} channel.`, components: [] })
					}
					if (confirmationButton?.customId === `configRemove${buttonChannelType}No`) {
						return await interaction.editReply({ content: "Alright! I haven't made any changes.", components: [] })
					}
					break
				}
			}
		}

		if (action === 'configStaffRoles') {
			const components: MessageActionRow[] = []

			if (await this.container.members.hasPermission(interaction.member, 'owner')) {
				components.push(
					new MessageActionRow({
						components: [
							{ type: 'BUTTON', style: 'SUCCESS', label: 'Set Admin Role', customId: 'configSetAdminRole' },
							{ type: 'BUTTON', style: 'DANGER', label: 'Remove Admin Role', customId: 'configRemoveAdminRole' },
						],
					})
				)
			}

			if (await this.container.members.hasPermission(interaction.member, 'admin')) {
				components.push(
					new MessageActionRow({
						components: [
							{ type: 'BUTTON', style: 'SUCCESS', label: 'Set Sr. Mod Role', customId: 'configSetSrModRole' },
							{ type: 'BUTTON', style: 'DANGER', label: 'Remove Sr. Mod Role', customId: 'configRemoveSrModRole' },
						],
					})
				)
			}

			if (await this.container.members.hasPermission(interaction.member, 'srMod')) {
				components.push(
					new MessageActionRow({
						components: [
							{ type: 'BUTTON', style: 'SUCCESS', label: 'Set Moderator Role', customId: 'configSetModeratorRole' },
							{ type: 'BUTTON', style: 'DANGER', label: 'Remove Moderator Role', customId: 'configRemoveModeratorRole' },
						],
					})
				)
			}

			if (await this.container.members.hasPermission(interaction.member, 'moderator')) {
				components.push(
					new MessageActionRow({
						components: [
							{ type: 'BUTTON', style: 'SUCCESS', label: 'Set Helper Role', customId: 'configSetHelperRole' },
							{ type: 'BUTTON', style: 'DANGER', label: 'Remove Helper Role', customId: 'configRemoveHelperRole' },
						],
					})
				)
			}

			if (await this.container.members.hasPermission(interaction.member, 'helper')) {
				components.push(
					new MessageActionRow({
						components: [
							{ type: 'BUTTON', style: 'SUCCESS', label: 'Set Trial Helper Role', customId: 'configSetTrialHelperRole' },
							{ type: 'BUTTON', style: 'DANGER', label: 'Remove Trial Helper Role', customId: 'configRemoveTrialHelperRole' },
						],
					})
				)
			}

			await interaction.editReply({
				content:
					'What would you like to do with the staff roles?\nYou can only set staff roles that are below your current permissions level. For example, sr. mods can only set moderator and below, but admins can only set sr. mod and below.\nIf you want to change the owner role, use `/set-owner-role`.',
				components,
			})

			const actionButton = await this.container.utils.awaitButton(interaction.user.id, id, interaction.channel)

			await actionButton?.deferUpdate()

			switch (actionButton?.customId) {
				case 'configSetAdminRole': {
					const roleType = 'admin'
					const buttonRoleType = 'Admin'

					if (!(await this.container.members.hasPermission(interaction.member, 'owner'))) {
						return await interaction.editReply({ content: 'You need owner permissions to manage this role!', components: [] })
					}

					const msg = await this.container.utils.promptMessage(interaction, {
						content: `Please mention, or send the ID or name of the role that you would like to change the ${roleType} role to.`,
						components: [],
					})
					if (!msg) {
						return await interaction.editReply("I can't get a role from nothing!")
					}

					await msg.delete()

					const role = this.container.guilds.findRole(interaction.guild, msg.content)
					if (!role) {
						return await interaction.editReply({ content: "I couldn't find that role." })
					}

					await interaction.editReply({
						content: `Are you sure you want to set the ${roleType} role to **${role.toString()}**?`,
						components: [
							{
								type: 'ACTION_ROW',
								components: [
									{ type: 'BUTTON', style: 'SUCCESS', label: 'Yes', customId: `configSet${buttonRoleType}RoleYes` },
									{ type: 'BUTTON', style: 'DANGER', label: 'No', customId: `configSet${buttonRoleType}RoleNo` },
								],
							},
						],
					})

					const confirmationButton = await this.container.utils.awaitButton(interaction.user.id, id, interaction.channel)

					if (confirmationButton?.customId === `configSet${buttonRoleType}RoleYes`) {
						await this.container.database.guilds.update({ adminRole: role.id }, { where: { id: interaction.guildId } })

						return await interaction.editReply({ content: `Succesfully set this guild's ${roleType} role to **${role.toString()}**.`, components: [] })
					}
					if (confirmationButton?.customId === `configSet${buttonRoleType}RoleNo`) {
						return await interaction.editReply({ content: "Alright! I haven't made any changes.", components: [] })
					}

					break
				}
				case 'configRemoveAdminRole': {
					const roleType = 'admin'
					const buttonRoleType = 'Admin'

					if (!(await this.container.members.hasPermission(interaction.member, 'owner'))) {
						return await interaction.editReply({ content: 'You need owner permissions to manage this role!', components: [] })
					}

					await interaction.editReply({
						content: `Are you sure you want to remove this guild's ${roleType} role?`,
						components: [
							{
								type: 'ACTION_ROW',
								components: [
									{ type: 'BUTTON', style: 'SUCCESS', label: 'Yes', customId: `configRemove${buttonRoleType}RoleYes` },
									{ type: 'BUTTON', style: 'DANGER', label: 'No', customId: `configRemove${buttonRoleType}RoleNo` },
								],
							},
						],
					})

					const confirmationButton = await this.container.utils.awaitButton(interaction.user.id, id, interaction.channel)

					if (confirmationButton?.customId === `configRemove${buttonRoleType}RoleYes`) {
						await this.container.database.guilds.update({ adminRole: null }, { where: { id: interaction.guildId } })

						return await interaction.editReply({ content: `Succesfully removed this guild's ${roleType} role.`, components: [] })
					}
					if (confirmationButton?.customId === `configRemove${buttonRoleType}RoleNo`) {
						return await interaction.editReply({ content: "Alright! I haven't made any changes.", components: [] })
					}
					break
				}

				case 'configSetSrModRole': {
					const roleType = 'sr. mod'
					const buttonRoleType = 'SrMod'

					if (!(await this.container.members.hasPermission(interaction.member, 'admin'))) {
						return await interaction.editReply({ content: 'You need admin permissions to manage this role!', components: [] })
					}

					const msg = await this.container.utils.promptMessage(interaction, {
						content: `Please mention, or send the ID or name of the role that you would like to change the ${roleType} role to.`,
						components: [],
					})
					if (!msg) {
						return await interaction.editReply("I can't get a role from nothing!")
					}

					await msg.delete()

					const role = this.container.guilds.findRole(interaction.guild, msg.content)
					if (!role) {
						return await interaction.editReply({ content: "I couldn't find that role." })
					}

					await interaction.editReply({
						content: `Are you sure you want to set the ${roleType} role to **${role.toString()}**?`,
						components: [
							{
								type: 'ACTION_ROW',
								components: [
									{ type: 'BUTTON', style: 'SUCCESS', label: 'Yes', customId: `configSet${buttonRoleType}RoleYes` },
									{ type: 'BUTTON', style: 'DANGER', label: 'No', customId: `configSet${buttonRoleType}RoleNo` },
								],
							},
						],
					})

					const confirmationButton = await this.container.utils.awaitButton(interaction.user.id, id, interaction.channel)

					if (confirmationButton?.customId === `configSet${buttonRoleType}RoleYes`) {
						await this.container.database.guilds.update({ srModRole: role.id }, { where: { id: interaction.guildId } })

						return await interaction.editReply({ content: `Succesfully set this guild's ${roleType} role to **${role.toString()}**.`, components: [] })
					}
					if (confirmationButton?.customId === `configSet${buttonRoleType}RoleNo`) {
						return await interaction.editReply({ content: "Alright! I haven't made any changes.", components: [] })
					}

					break
				}
				case 'configRemoveSrModRole': {
					const roleType = 'sr. mod'
					const buttonRoleType = 'SrMod'

					if (!(await this.container.members.hasPermission(interaction.member, 'admin'))) {
						return await interaction.editReply({ content: 'You need admin permissions to manage this role!', components: [] })
					}

					await interaction.editReply({
						content: `Are you sure you want to remove this guild's ${roleType} role?`,
						components: [
							{
								type: 'ACTION_ROW',
								components: [
									{ type: 'BUTTON', style: 'SUCCESS', label: 'Yes', customId: `configRemove${buttonRoleType}RoleYes` },
									{ type: 'BUTTON', style: 'DANGER', label: 'No', customId: `configRemove${buttonRoleType}RoleNo` },
								],
							},
						],
					})

					const confirmationButton = await this.container.utils.awaitButton(interaction.user.id, id, interaction.channel)

					if (confirmationButton?.customId === `configRemove${buttonRoleType}RoleYes`) {
						await this.container.database.guilds.update({ srModRole: null }, { where: { id: interaction.guildId } })

						return await interaction.editReply({ content: `Succesfully removed this guild's ${roleType} role.`, components: [] })
					}
					if (confirmationButton?.customId === `configRemove${buttonRoleType}RoleNo`) {
						return await interaction.editReply({ content: "Alright! I haven't made any changes.", components: [] })
					}
					break
				}

				case 'configSetModeratorRole': {
					const roleType = 'moderator'
					const buttonRoleType = 'Moderator'

					if (!(await this.container.members.hasPermission(interaction.member, 'srMod'))) {
						return await interaction.editReply({ content: 'You need sr. mod permissions to manage this role!', components: [] })
					}

					const msg = await this.container.utils.promptMessage(interaction, {
						content: `Please mention, or send the ID or name of the role that you would like to change the ${roleType} role to.`,
						components: [],
					})
					if (!msg) {
						return await interaction.editReply("I can't get a role from nothing!")
					}

					await msg.delete()

					const role = this.container.guilds.findRole(interaction.guild, msg.content)
					if (!role) {
						return await interaction.editReply({ content: "I couldn't find that role." })
					}

					await interaction.editReply({
						content: `Are you sure you want to set the ${roleType} role to **${role.toString()}**?`,
						components: [
							{
								type: 'ACTION_ROW',
								components: [
									{ type: 'BUTTON', style: 'SUCCESS', label: 'Yes', customId: `configSet${buttonRoleType}RoleYes` },
									{ type: 'BUTTON', style: 'DANGER', label: 'No', customId: `configSet${buttonRoleType}RoleNo` },
								],
							},
						],
					})

					const confirmationButton = await this.container.utils.awaitButton(interaction.user.id, id, interaction.channel)

					if (confirmationButton?.customId === `configSet${buttonRoleType}RoleYes`) {
						await this.container.database.guilds.update({ modRole: role.id }, { where: { id: interaction.guildId } })

						return await interaction.editReply({ content: `Succesfully set this guild's ${roleType} role to **${role.toString()}**.`, components: [] })
					}
					if (confirmationButton?.customId === `configSet${buttonRoleType}RoleNo`) {
						return await interaction.editReply({ content: "Alright! I haven't made any changes.", components: [] })
					}

					break
				}
				case 'configRemoveModeratorRole': {
					const roleType = 'moderator'
					const buttonRoleType = 'Moderator'

					if (!(await this.container.members.hasPermission(interaction.member, 'srMod'))) {
						return await interaction.editReply({ content: 'You need sr. mod permissions to manage this role!', components: [] })
					}

					await interaction.editReply({
						content: `Are you sure you want to remove this guild's ${roleType} role?`,
						components: [
							{
								type: 'ACTION_ROW',
								components: [
									{ type: 'BUTTON', style: 'SUCCESS', label: 'Yes', customId: `configRemove${buttonRoleType}RoleYes` },
									{ type: 'BUTTON', style: 'DANGER', label: 'No', customId: `configRemove${buttonRoleType}RoleNo` },
								],
							},
						],
					})

					const confirmationButton = await this.container.utils.awaitButton(interaction.user.id, id, interaction.channel)

					if (confirmationButton?.customId === `configRemove${buttonRoleType}RoleYes`) {
						await this.container.database.guilds.update({ modRole: null }, { where: { id: interaction.guildId } })

						return await interaction.editReply({ content: `Succesfully removed this guild's ${roleType} role.`, components: [] })
					}
					if (confirmationButton?.customId === `configRemove${buttonRoleType}RoleNo`) {
						return await interaction.editReply({ content: "Alright! I haven't made any changes.", components: [] })
					}
					break
				}

				case 'configSetHelperRole': {
					const roleType = 'helper'
					const buttonRoleType = 'Helper'

					if (!(await this.container.members.hasPermission(interaction.member, 'moderator'))) {
						return await interaction.editReply({ content: 'You need moderator permissions to manage this role!', components: [] })
					}

					const msg = await this.container.utils.promptMessage(interaction, {
						content: `Please mention, or send the ID or name of the role that you would like to change the ${roleType} role to.`,
						components: [],
					})
					if (!msg) {
						return await interaction.editReply("I can't get a role from nothing!")
					}

					await msg.delete()

					const role = this.container.guilds.findRole(interaction.guild, msg.content)
					if (!role) {
						return await interaction.editReply({ content: "I couldn't find that role." })
					}

					await interaction.editReply({
						content: `Are you sure you want to set the ${roleType} role to **${role.toString()}**?`,
						components: [
							{
								type: 'ACTION_ROW',
								components: [
									{ type: 'BUTTON', style: 'SUCCESS', label: 'Yes', customId: `configSet${buttonRoleType}RoleYes` },
									{ type: 'BUTTON', style: 'DANGER', label: 'No', customId: `configSet${buttonRoleType}RoleNo` },
								],
							},
						],
					})

					const confirmationButton = await this.container.utils.awaitButton(interaction.user.id, id, interaction.channel)

					if (confirmationButton?.customId === `configSet${buttonRoleType}RoleYes`) {
						await this.container.database.guilds.update({ helperRole: role.id }, { where: { id: interaction.guildId } })

						return await interaction.editReply({ content: `Succesfully set this guild's ${roleType} role to **${role.toString()}**.`, components: [] })
					}
					if (confirmationButton?.customId === `configSet${buttonRoleType}RoleNo`) {
						return await interaction.editReply({ content: "Alright! I haven't made any changes.", components: [] })
					}

					break
				}
				case 'configRemoveHelperRole': {
					const roleType = 'helper'
					const buttonRoleType = 'Helper'

					if (!(await this.container.members.hasPermission(interaction.member, 'moderator'))) {
						return await interaction.editReply({ content: 'You need moderator permissions to manage this role!', components: [] })
					}

					await interaction.editReply({
						content: `Are you sure you want to remove this guild's ${roleType} role?`,
						components: [
							{
								type: 'ACTION_ROW',
								components: [
									{ type: 'BUTTON', style: 'SUCCESS', label: 'Yes', customId: `configRemove${buttonRoleType}RoleYes` },
									{ type: 'BUTTON', style: 'DANGER', label: 'No', customId: `configRemove${buttonRoleType}RoleNo` },
								],
							},
						],
					})

					const confirmationButton = await this.container.utils.awaitButton(interaction.user.id, id, interaction.channel)

					if (confirmationButton?.customId === `configRemove${buttonRoleType}RoleYes`) {
						await this.container.database.guilds.update({ helperRole: null }, { where: { id: interaction.guildId } })

						return await interaction.editReply({ content: `Succesfully removed this guild's ${roleType} role.`, components: [] })
					}
					if (confirmationButton?.customId === `configRemove${buttonRoleType}RoleNo`) {
						return await interaction.editReply({ content: "Alright! I haven't made any changes.", components: [] })
					}
					break
				}

				case 'configSetTrialHelperRole': {
					const roleType = 'trial helper'
					const buttonRoleType = 'TrialHelper'

					if (!(await this.container.members.hasPermission(interaction.member, 'helper'))) {
						return await interaction.editReply({ content: 'You need helper permissions to manage this role!', components: [] })
					}

					const msg = await this.container.utils.promptMessage(interaction, {
						content: `Please mention, or send the ID or name of the role that you would like to change the ${roleType} role to.`,
						components: [],
					})
					if (!msg) {
						return await interaction.editReply("I can't get a role from nothing!")
					}

					await msg.delete()

					const role = this.container.guilds.findRole(interaction.guild, msg.content)
					if (!role) {
						return await interaction.editReply({ content: "I couldn't find that role." })
					}

					await interaction.editReply({
						content: `Are you sure you want to set the ${roleType} role to **${role.toString()}**?`,
						components: [
							{
								type: 'ACTION_ROW',
								components: [
									{ type: 'BUTTON', style: 'SUCCESS', label: 'Yes', customId: `configSet${buttonRoleType}RoleYes` },
									{ type: 'BUTTON', style: 'DANGER', label: 'No', customId: `configSet${buttonRoleType}RoleNo` },
								],
							},
						],
					})

					const confirmationButton = await this.container.utils.awaitButton(interaction.user.id, id, interaction.channel)

					if (confirmationButton?.customId === `configSet${buttonRoleType}RoleYes`) {
						await this.container.database.guilds.update({ trialHelperRole: role.id }, { where: { id: interaction.guildId } })

						return await interaction.editReply({ content: `Succesfully set this guild's ${roleType} role to **${role.toString()}**.`, components: [] })
					}
					if (confirmationButton?.customId === `configSet${buttonRoleType}RoleNo`) {
						return await interaction.editReply({ content: "Alright! I haven't made any changes.", components: [] })
					}

					break
				}
				case 'configRemoveTrialHelperRole': {
					const roleType = 'admin'
					const buttonRoleType = 'Admin'

					await interaction.editReply({
						content: `Are you sure you want to remove this guild's ${roleType} role?`,
						components: [
							{
								type: 'ACTION_ROW',
								components: [
									{ type: 'BUTTON', style: 'SUCCESS', label: 'Yes', customId: `configRemove${buttonRoleType}RoleYes` },
									{ type: 'BUTTON', style: 'DANGER', label: 'No', customId: `configRemove${buttonRoleType}RoleNo` },
								],
							},
						],
					})

					const confirmationButton = await this.container.utils.awaitButton(interaction.user.id, id, interaction.channel)

					if (confirmationButton?.customId === `configRemove${buttonRoleType}RoleYes`) {
						await this.container.database.guilds.update({ trialHelperRole: null }, { where: { id: interaction.guildId } })

						return await interaction.editReply({ content: `Succesfully removed this guild's ${roleType} role.`, components: [] })
					}
					if (confirmationButton?.customId === `configRemove${buttonRoleType}RoleNo`) {
						return await interaction.editReply({ content: "Alright! I haven't made any changes.", components: [] })
					}
					break
				}
			}
		}

		if (action === 'configMuteRole') {
			await interaction.editReply({
				content: 'What would you like to do to the mute role?',
				components: [
					{
						type: 'ACTION_ROW',
						components: [
							{ type: 'BUTTON', label: 'Set', style: 'SUCCESS', customId: 'configSetMuteRole' },
							{ type: 'BUTTON', label: 'Remove', style: 'DANGER', customId: 'configRemoveMuteRole' },
						],
					},
				],
			})

			const actionButton = await this.container.utils.awaitButton(interaction.user.id, id, interaction.channel)

			switch (actionButton?.customId) {
				case 'configSetMuteRole': {
					const msg = await this.container.utils.promptMessage(interaction, {
						content: `Please mention, or send the ID or name of the role that you would like to change the muted role to.`,
						components: [],
					})
					if (!msg) {
						return await interaction.editReply("I can't get a role from nothing!")
					}

					await msg.delete()

					const role = this.container.guilds.findRole(interaction.guild, msg.content)
					if (!role) {
						return await interaction.editReply({ content: "I couldn't find that role." })
					}

					await interaction.editReply({
						content: `Are you sure you want to set the muted role to **${role.toString()}**?`,
						components: [
							{
								type: 'ACTION_ROW',
								components: [
									{ type: 'BUTTON', style: 'SUCCESS', label: 'Yes', customId: `configSetMuteRoleYes` },
									{ type: 'BUTTON', style: 'DANGER', label: 'No', customId: `configSetMuteRoleNo` },
								],
							},
						],
					})

					const confirmationButton = await this.container.utils.awaitButton(interaction.user.id, id, interaction.channel)

					if (confirmationButton?.customId === `configSetMuteRoleYes`) {
						await this.container.database.guilds.update({ muteRole: role.id }, { where: { id: interaction.guildId } })

						return await interaction.editReply({ content: `Succesfully set this guild's muted role to **${role.toString()}**.`, components: [] })
					}
					if (confirmationButton?.customId === `configSetMuteRoleNo`) {
						return await interaction.editReply({ content: "Alright! I haven't made any changes.", components: [] })
					}

					break
				}
				case 'configRemoveMuteRole': {
					await interaction.editReply({
						content: `Are you sure you want to remove this guild's mute role?`,
						components: [
							{
								type: 'ACTION_ROW',
								components: [
									{ type: 'BUTTON', style: 'SUCCESS', label: 'Yes', customId: `configRemoveMuteRoleYes` },
									{ type: 'BUTTON', style: 'DANGER', label: 'No', customId: `configRemoveMuteRoleNo` },
								],
							},
						],
					})

					const confirmationButton = await this.container.utils.awaitButton(interaction.user.id, id, interaction.channel)

					await confirmationButton?.deferUpdate()

					if (confirmationButton?.customId === `configRemoveMuteRoleYes`) {
						await this.container.database.guilds.update({ muteRole: null }, { where: { id: interaction.guildId } })

						return await interaction.editReply({ content: `Succesfully removed this guild's muted role.`, components: [] })
					}
					if (confirmationButton?.customId === `configRemoveMuteRoleNo`) {
						return await interaction.editReply({ content: "Alright! I haven't made any changes.", components: [] })
					}
					break
				}
			}
		}

		if (action === 'configRestrictedChannels') {
			const msg = await this.container.utils.promptMessage(interaction, {
				content: `Please mention the channel that you would like to manage.`,
				components: [],
			})
			if (!msg) {
				return await interaction.editReply("I can't get a channel from nothing!")
			}

			await msg.delete()

			const channel = this.container.guilds.findChannel(interaction.guild, msg.content)
			if (!channel) {
				return await interaction.editReply({ content: "I couldn't find that channel." })
			}
			if (!isGuildBasedChannel(channel)) {
				return await interaction.editReply({ content: 'Please select a text channel.' })
			}

			const isLocked = await this.container.channels.isLocked(channel)

			const firstRow = new MessageActionRow()
			const secondRow = new MessageActionRow()

			if (await this.container.members.hasPermission(interaction.member, 'owner')) {
				firstRow.components.push(new MessageButton({ type: 'BUTTON', label: PermNames.admin, style: 'PRIMARY', customId: 'configSetChannelAdminPerms' }))
			}
			if (await this.container.members.hasPermission(interaction.member, 'admin')) {
				firstRow.components.push(new MessageButton({ type: 'BUTTON', label: PermNames.srMod, style: 'PRIMARY', customId: 'configSetChannelSrModPerms' }))
			}
			if (await this.container.members.hasPermission(interaction.member, 'srMod')) {
				firstRow.components.push(new MessageButton({ type: 'BUTTON', label: PermNames.moderator, style: 'PRIMARY', customId: 'configSetChannelModPerms' }))
			}
			if (await this.container.members.hasPermission(interaction.member, 'moderator')) {
				firstRow.components.push(new MessageButton({ type: 'BUTTON', label: PermNames.helper, style: 'PRIMARY', customId: 'configSetChannelHelperPerms' }))
			}
			if (await this.container.members.hasPermission(interaction.member, 'helper')) {
				firstRow.components.push(new MessageButton({ type: 'BUTTON', label: PermNames.trialHelper, style: 'PRIMARY', customId: 'configSetChannelTrialHelperPerms' }))
			}

			if (isLocked) {
				secondRow.components.push(new MessageButton({ type: 'BUTTON', label: 'Clear Perms', style: 'DANGER', customId: 'configRemoveChannelPerms' }))
			}

			await interaction.editReply({ content: null, embeds: [], components: secondRow.components.length !== 0 ? [firstRow, secondRow] : [firstRow] })

			const button = await this.container.utils.awaitButton(interaction.user.id, id, interaction.channel)
			if (!button) {
				return await interaction.editReply({ content: "I can't get a perm level if you don't press a button.", components: [] })
			}
			await button.deferUpdate()
			const buttonId = button.customId as unknown as
				| 'configSetChannelAdminPerms'
				| 'configSetChannelSrModPerms'
				| 'configSetChannelModPerms'
				| 'configSetChannelHelperPerms'
				| 'configSetChannelTrialHelperPerms'
				| 'configRemoveChannelPerms'

			if (buttonId === 'configRemoveChannelPerms') {
				await interaction.editReply({
					content: `Are you sure you want to remove the perm restrictions from ${channel.toString()}?`,
					components: [
						{
							type: 'ACTION_ROW',
							components: [
								{ type: 'BUTTON', label: 'Yes', style: 'SUCCESS', customId: 'configRemoveChannelPermsYes' },
								{ type: 'BUTTON', label: 'No', style: 'DANGER', customId: 'configRemoveChannelPermsNo' },
							],
						},
					],
				})

				const button = await this.container.utils.awaitButton(interaction.user.id, id, interaction.channel)
				if (!button) {
					return await interaction.editReply({ content: "I can't tell what you want to do if you don't press a button.", components: [] })
				}

				switch (button.customId) {
					case 'configRemoveChannelPermsYes': {
						const changed = await this.container.channels.changePerms(interaction.channel, 'none')

						if (!changed) {
							return await interaction.editReply({ content: "I failed to change that channel's perms.", components: [] })
						}

						return await interaction.editReply({ content: "Alright! I've cleared that channel's perms.", components: [] })
					}

					case 'configRemoveChannelPermsNo': {
						return await interaction.editReply({ content: "Alright. I haven't made any changes.", components: [] })
					}
				}
			}

			let perms: Perms = 'none'

			if (buttonId === 'configSetChannelAdminPerms') {
				perms = 'admin'
			}
			if (buttonId === 'configSetChannelSrModPerms') {
				perms = 'srMod'
			}
			if (buttonId === 'configSetChannelModPerms') {
				perms = 'moderator'
			}
			if (buttonId === 'configSetChannelHelperPerms') {
				perms = 'helper'
			}
			if (buttonId === 'configSetChannelTrialHelperPerms') {
				perms = 'trialHelper'
			}

			if (perms !== 'none') {
				await interaction.editReply({
					content: `Are you sure that you want to set ${channel.toString()}'s perms to ${PermNames[perms]}?`,
					components: [
						{
							type: 'ACTION_ROW',
							components: [
								{ type: 'BUTTON', label: 'Yes', style: 'SUCCESS', customId: 'configSetChannelPermsYes' },
								{ type: 'BUTTON', label: 'No', style: 'DANGER', customId: 'configSetChannelPermsNo' },
							],
						},
					],
				})

				const button = await this.container.utils.awaitButton(interaction.user.id, id, interaction.channel)
				if (!button) {
					return await interaction.editReply({ content: "I can't tell what you want to do if you don't press a button.", components: [] })
				}

				switch (button.customId) {
					case 'configSetChannelPermsYes': {
						const changed = await this.container.channels.changePerms(channel, perms)
						if (!changed) {
							return await interaction.editReply({ content: `I failed to change ${channel.toString()}'s restricted perms to ${PermNames[perms]}.`, components: [] })
						}

						return await interaction.editReply({ content: `I've succesfully set ${channel.toString()}'s restricted perms to ${PermNames[perms]}.`, components: [] })
					}
					case 'configSetChannelPermsNo': {
						return await interaction.editReply({ content: "Alright. I haven't made any changes.", components: [] })
					}
				}
			}
		}

		if (action === 'configAfterPunishMessage') {
			await got.post(`https://discord.com/api/v10/interactions/${apId}/${apToken}/callback`, {
				json: {
					type: 9,
					data: {
						custom_id: 'afterPunishmentModal',
						title: 'After Punishment Message Modal',
						components: [
							{
								type: 1,
								components: [
									{
										type: 4,
										custom_id: 'message',
										label: 'After Punishment Message',
										style: 2,
										min_length: 1,
										max_length: 1500,
										placeholder: "Type the message you'd like to be sent after a punishment here!",
										required: true,
									},
								],
							},
						],
					},
				},
			})

			this.container.client.ws.on('INTERACTION_CREATE', async (i) => {
				if (i.data.custom_id === 'afterPunishmentModal') {
					const message = i.data.components[0].components[0].value

					await got.post(`https://discord.com/api/v10/interactions/${i.id}/${i.token}/callback`, {
						json: {
							type: 4,
							data: {
								content: `Would you like to set this guild's after punishment message to the following:\n${message}`,
								components: [
									{
										type: ComponentType.ActionRow,
										components: [
											{ type: ComponentType.Button, label: 'Yes', style: ButtonStyle.Success, custom_id: 'configAfterPunishYes' },
											{ type: ComponentType.Button, label: 'No', style: ButtonStyle.Danger, custom_id: 'configAfterPunishNo' },
										],
									},
								],
							},
						},
					})

					const reply = await JSON.parse((await got.get(`https://discord.com/api/v10/webhooks/${this.container.client.id}/${i.token}/messages/@original`)).body)

					const confirmationButton = await this.container.utils.awaitButton(interaction.user.id, reply.id, interaction.channel as TextChannel)

					if (confirmationButton?.customId === `configAfterPunishYes`) {
						await got.delete(`https://discord.com/api/v10/webhooks/${this.container.client.id}/${i.token}/messages/@original`)
						await this.container.database.guilds.update({ afterPunishmentMessage: message }, { where: { id: interaction.guildId as string } })

						return await interaction.editReply({ content: `Succesfully set this guild's after punishment message!.`, components: [] })
					}
					if (confirmationButton?.customId === `configAfterPunishNo`) {
						await got.delete(`https://discord.com/api/v10/webhooks/${this.container.client.id}/${i.token}/messages/@original`)
						return await interaction.editReply({ content: "Alright! I haven't made any changes.", components: [] })
					}
				}
			})
		}

		if (action === 'configView') {
			await interaction.editReply({
				content: 'What would you like to see?',
				components: [
					{
						type: 'ACTION_ROW',
						components: [
							{ type: 'BUTTON', label: 'Welcome/Leave', style: 'PRIMARY', customId: 'configViewWelcome' },
							{ type: 'BUTTON', label: 'Moderation', style: 'PRIMARY', customId: 'configViewModeration' },
							{ type: 'BUTTON', label: 'Permissions', style: 'PRIMARY', customId: 'configViewPermissions' },
						],
					},
				],
			})

			const type = await this.container.utils.awaitButton(interaction.user.id, id, interaction.channel)

			await type?.deferUpdate()

			const {
				welcomeMessage,
				leaveMessage,
				welcomeChannel,
				muteRole,
				afterPunishmentMessage,
				messageLoggingChannel,
				memberLoggingChannel,
				moderationLoggingChannel,
				actionLoggingChannel,
				ownerRole,
				adminRole,
				srModRole,
				modRole,
				helperRole,
				trialHelperRole,
				ownerOnlyChannels,
				adminOnlyChannels,
				srModOnlyChannels,
				modOnlyChannels,
				helperOnlyChannels,
				trialHelperOnlyChannels,
			} = (await this.container.database.guilds.findByPk(interaction.guild.id)) as GuildDatabase

			const rolesFormatted = {
				muteRole: muteRole && interaction.guild.roles.cache.get(muteRole) ? `${this.format(muteRole, 'role')} (${interaction.guild.roles.cache.get(muteRole)?.name})` : '*not set*',
				ownerRole: ownerRole && interaction.guild.roles.cache.get(ownerRole) ? `${this.format(ownerRole, 'role')} (${interaction.guild.roles.cache.get(ownerRole)?.name})` : '*not set*',
				adminRole: adminRole && interaction.guild.roles.cache.get(adminRole) ? `${this.format(adminRole, 'role')} (${interaction.guild.roles.cache.get(adminRole)?.name})` : '*not set*',
				srModRole: srModRole && interaction.guild.roles.cache.get(srModRole) ? `${this.format(srModRole, 'role')} (${interaction.guild.roles.cache.get(srModRole)?.name})` : '*not set*',
				modRole: modRole && interaction.guild.roles.cache.get(modRole) ? `${this.format(modRole, 'role')} (${interaction.guild.roles.cache.get(modRole)?.name})` : '*not set*',
				helperRole: helperRole && interaction.guild.roles.cache.get(helperRole) ? `${this.format(helperRole, 'role')} (${interaction.guild.roles.cache.get(helperRole)?.name})` : '*not set*',
				trialHelperRole:
					trialHelperRole && interaction.guild.roles.cache.get(trialHelperRole)
						? `${this.format(trialHelperRole, 'role')} (${interaction.guild.roles.cache.get(trialHelperRole)?.name})`
						: '*not set*',
			}
			const channels = {
				ownerOnlyChannels: ownerOnlyChannels.map((c) => this.format(c, 'channel')).join(', '),
				adminOnlyChannels: adminOnlyChannels.map((c) => this.format(c, 'channel')).join(', '),
				srModOnlyChannels: srModOnlyChannels.map((c) => this.format(c, 'channel')).join(', '),
				modOnlyChannels: modOnlyChannels.map((c) => this.format(c, 'channel')).join(', '),
				helperOnlyChannels: helperOnlyChannels.map((c) => this.format(c, 'channel')).join(', '),
				trialHelperOnlyChannels: trialHelperOnlyChannels.map((c) => this.format(c, 'channel')).join(', '),
			}
			const channelsFormatted = {
				messageLoggingChannel:
					messageLoggingChannel && interaction.guild.channels.cache.get(messageLoggingChannel)
						? `${this.format(messageLoggingChannel, 'channel')} (\`${messageLoggingChannel}\`)`
						: '*not set*',
				memberLoggingChannel:
					memberLoggingChannel && interaction.guild.channels.cache.get(memberLoggingChannel) ? `${this.format(memberLoggingChannel, 'channel')} (\`${memberLoggingChannel}\`)` : '*not set*',
				moderationLoggingChannel:
					moderationLoggingChannel && interaction.guild.channels.cache.get(moderationLoggingChannel)
						? `${this.format(moderationLoggingChannel, 'channel')} (\`${moderationLoggingChannel}\`)`
						: '*not set*',
				actionLoggingChannel:
					actionLoggingChannel && interaction.guild.channels.cache.get(actionLoggingChannel) ? `${this.format(actionLoggingChannel, 'channel')} (\`${actionLoggingChannel}\`)` : '*not set*',

				ownerOnlyChannels: channels.ownerOnlyChannels.length === 0 ? '*none set*' : channels.ownerOnlyChannels,
				adminOnlyChannels: channels.adminOnlyChannels.length === 0 ? '*none set*' : channels.adminOnlyChannels,
				srModOnlyChannels: channels.srModOnlyChannels.length === 0 ? '*none set*' : channels.srModOnlyChannels,
				modOnlyChannels: channels.modOnlyChannels.length === 0 ? '*none set*' : channels.modOnlyChannels,
				helperOnlyChannels: channels.helperOnlyChannels.length === 0 ? '*none set*' : channels.helperOnlyChannels,
				trialHelperOnlyChannels: channels.trialHelperOnlyChannels.length === 0 ? '*none set*' : channels.trialHelperOnlyChannels,
			}

			switch (type?.customId) {
				case 'configViewWelcome': {
					await interaction.editReply({
						content: null,
						embeds: [
							{
								title: 'Welcome/Leave Info',
								fields: [
									{ name: 'Channel', value: this.format(welcomeChannel, 'channel') ?? '*not set*' },
									{ name: 'Join Message', value: welcomeMessage ?? '*not set*' },
									{ name: 'Leave Message', value: leaveMessage ?? '*not set*' },
								],
							},
						],
						components: [],
					})
					break
				}
				case 'configViewModeration': {
					await interaction.editReply({
						content: null,
						embeds: [
							{
								title: 'Moderation Info',
								fields: [
									{ name: 'Mute Role', value: rolesFormatted.muteRole },
									{ name: 'After Punishment Message', value: afterPunishmentMessage ?? '*not set*' },

									{
										name: 'Logging Channels',
										value: `Message: ${channelsFormatted.messageLoggingChannel}\nMember: ${channelsFormatted.memberLoggingChannel}\nModeration: ${channelsFormatted.moderationLoggingChannel}\nAction: ${channelsFormatted.actionLoggingChannel}`,
									},
								],
							},
						],
						components: [],
					})
					break
				}

				case 'configViewPermissions': {
					await interaction.editReply({
						content: null,
						embeds: [
							{
								title: 'Permissions Info',
								fields: [
									{
										name: 'Restricted Channels',
										value: `${PermNames.owner}: ${channelsFormatted.ownerOnlyChannels}\n${PermNames.admin}: ${channelsFormatted.adminOnlyChannels}\n${PermNames.srMod}: ${channelsFormatted.srModOnlyChannels}\n${PermNames.moderator}: ${channelsFormatted.modOnlyChannels}\n${PermNames.helper}: ${channelsFormatted.helperOnlyChannels}\n${PermNames.trialHelper}: ${channelsFormatted.trialHelperOnlyChannels}\n`,
									},
									{
										name: 'Staff Roles',
										value: `${PermNames.owner}: ${rolesFormatted.ownerRole}\n${PermNames.admin}: ${rolesFormatted.adminRole}\n${PermNames.srMod}: ${rolesFormatted.srModRole}\n${PermNames.moderator}: ${rolesFormatted.modRole}\n${PermNames.helper}: ${rolesFormatted.helperRole}\n${PermNames.trialHelper}: ${rolesFormatted.trialHelperRole}\n`,
									},
								],
							},
						],
						components: [],
					})
				}
			}
		}
	}

	format(thing: string | null, type: 'role' | 'channel') {
		if (!thing) {
			return thing
		}

		return type === 'role' ? `<@&${thing}>` : `<#${thing}>`
	}
}
