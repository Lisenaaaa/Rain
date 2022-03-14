import { ApplyOptions } from '@sapphire/decorators'
import { isGuildBasedChannel } from '@sapphire/discord.js-utilities'
import { GuildTextBasedChannelTypes } from '@sapphire/discord.js-utilities'
import { CommandOptions } from '@sapphire/framework'
import { ButtonInteraction, ButtonStyle, CommandInteraction, ComponentType, Guild, InteractionReplyOptions, Message, Snowflake, TextChannel } from 'discord.js'
import RainCommand from '../../structures/RainCommand'

@ApplyOptions<CommandOptions>({
	name: 'config',
	aliases: ['config'],
	description: 'configure the guild',
	preconditions: ['slashOnly', 'permissions', 'GuildOnly'],
	defaultPermissions: 'srMod',
	userDiscordPerms: ['ManageGuild'],
	botPerms: ['ManageMessages'],
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
					type: ComponentType.ActionRow,
					components: [
						{
							type: ComponentType.Button,
							label: 'welcome',
							style: ButtonStyle.Primary,
							customId: 'configWelcome',
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
						type: ComponentType.ActionRow,
						components: [
							{ type: ComponentType.Button, label: 'Set Welcome/Leave Channel', style: ButtonStyle.Success, customId: 'configSetWelcomeChannel' },
							{ type: ComponentType.Button, label: 'Remove Welcome/Leave Channel', style: ButtonStyle.Danger, customId: 'configRemoveWelcomeChannel' },
						],
					},
					{
						type: ComponentType.ActionRow,
						components: [
							{ type: ComponentType.Button, label: 'Set Welcome Message', style: ButtonStyle.Success, customId: 'configSetWelcomeMessage' },
							{ type: ComponentType.Button, label: 'Remove Welcome Message', style: ButtonStyle.Danger, customId: 'configRemoveWelcomeMessage' },
						],
					},
					{
						type: ComponentType.ActionRow,
						components: [
							{ type: ComponentType.Button, label: 'Set Leave Message', style: ButtonStyle.Success, customId: 'configSetLeaveMessage' },
							{ type: ComponentType.Button, label: 'Remove Leave Message', style: ButtonStyle.Danger, customId: 'configRemoveLeaveMessage' },
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
								type: ComponentType.ActionRow,
								components: [
									{ type: ComponentType.Button, style: ButtonStyle.Success, label: 'Yes', customId: 'configSetWelcomeChannelYes' },
									{ type: ComponentType.Button, style: ButtonStyle.Danger, label: 'No', customId: 'configSetWelcomeChannelNo' },
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
								type: ComponentType.ActionRow,
								components: [
									{ type: ComponentType.Button, style: ButtonStyle.Success, label: 'Yes', customId: 'configRemoveWelcomeChannelYes' },
									{ type: ComponentType.Button, style: ButtonStyle.Danger, label: 'No', customId: 'configRemoveWelcomeChannelNo' },
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
					await interaction.editReply({ content: `set welcome message`, components: [] })
					break
				}
				case 'configRemoveWelcomeMessage': {
					await interaction.editReply({
						content: `Are you sure you want to remove this guild's welcome message, disabling the join messages?`,
						components: [
							{
								type: ComponentType.ActionRow,
								components: [
									{ type: ComponentType.Button, style: ButtonStyle.Success, label: 'Yes', customId: 'configRemoveWelcomeMessageYes' },
									{ type: ComponentType.Button, style: ButtonStyle.Danger, label: 'No', customId: 'configRemoveWelcomeMessageNo' },
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
								type: ComponentType.ActionRow,
								components: [
									{ type: ComponentType.Button, style: ButtonStyle.Success, label: 'Yes', customId: 'configRemoveLeaveMessageYes' },
									{ type: ComponentType.Button, style: ButtonStyle.Danger, label: 'No', customId: 'configRemoveLeaveMessageNo' },
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
			componentType: ComponentType.Button,
			filter: (b: ButtonInteraction<'cached'>) => b.user.id === userId && b.message.id === messageId,
			time: this.getTimeInSeconds(60),
		})
	}
}
