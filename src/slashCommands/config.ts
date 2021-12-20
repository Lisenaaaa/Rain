/* eslint-disable @typescript-eslint/no-unused-vars */
import type { PieceContext } from '@sapphire/framework'
import type { BaseCommandInteraction, Guild, Interaction, Message, MessageComponentInteraction } from 'discord.js'
import { SlashCommand } from '../structures/SlashCommandPiece'

export class Ping extends SlashCommand {
	constructor(context: PieceContext) {
		super(context, {
			name: 'config',
			description: "Access the guild's config.",
			options: [],
			guilds: ['880637463838724166'],
		})
	}

	async run(interaction: BaseCommandInteraction) {
		if (this.container.cache.guilds.get(interaction.guild?.id as string) === undefined) {
			await this.container.database.guilds.add(interaction.guild?.id as string)
		}
		const filter = (i: Interaction) => i.user.id == interaction.user.id
		const filterMsg = (m: Message) => m.author.id == interaction.user.id
		const filterRestrictChannels = (i: MessageComponentInteraction) => i.user.id === interaction.user.id && i.customId.startsWith('configRestrictChannels')
		const filterLog = (i: MessageComponentInteraction) => i.user.id === interaction.user.id && i.customId.startsWith('configLog')
		const filterStaffRoles = (i: MessageComponentInteraction) => i.user.id === interaction.user.id && i.customId.startsWith('configStaffRoles')

		const interactionCollector = interaction.channel?.createMessageComponentCollector({ filter, time: 60000 })
		const configRestrictChannelsInteractionCollector = interaction.channel?.createMessageComponentCollector({ filter: filterRestrictChannels, time: 60000 })
		const configLogInteractionCollector = interaction.channel?.createMessageComponentCollector({ filter: filterLog, time: 60000 })
		const staffRolesInteractionCollector = interaction.channel?.createMessageComponentCollector({ filter: filterStaffRoles, time: 60000 })
		const messageCollector = interaction.channel?.createMessageCollector({ filter: filterMsg, time: 60000 })

		await interaction.reply({
			embeds: [
				{
					title: `${interaction.guild}'s config'`,
					fields: [
						{
							name: 'Welcome Messages',
							value: 'Configure the message and channel that I send whenever someone joins the server.',
							inline: true,
						},
					],
				},
			],
			components: [
				{
					type: 'ACTION_ROW',
					components: [
						{
							customId: 'configWelcomeMessage',
							type: 'BUTTON',
							label: 'Welcome Messages',
							style: 'PRIMARY',
						},
					],
				},
			],
		})

		interactionCollector?.once('collect', async (i: Interaction) => {
			if (!i.isButton()) return

			if (i.customId === 'configWelcomeMessage') {
				await interaction.editReply({
					content: 'What channel would you like welcome messages to send in?',
					embeds: [],
					components: [],
				})

				messageCollector?.once('collect', async (m: Message) => {
					const channel = this.container.guilds.findChannel(m.guild as Guild, m.content)

					console.log(channel)
				})
			}
		})
	}
}
