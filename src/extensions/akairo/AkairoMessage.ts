import BotClient from '@extensions/RainClient'
import { AkairoMessage } from 'discord-akairo'
import { CommandInteraction, InteractionReplyOptions, MessageActionRow, MessageButton, MessageEmbedOptions, ReplyMessageOptions } from 'discord.js'

export class RainMessage extends AkairoMessage {
	declare client: BotClient

	public constructor(client: BotClient, options: CommandInteraction) {
		super(client, options)
	}

	async send(content: string | ReplyMessageOptions | InteractionReplyOptions, data: { reply: boolean } = { reply: true }) {
		return data.reply ? this.interaction.reply(content) : await this.channel?.send(content)
	}

	/**
	 * @param embeds An array of embeds, to use for the pages. This will overwrite whatever was set as the `footer` for each embed.
	 */
	async paginate(embeds: MessageEmbedOptions[]) {
		const length = embeds.length
		let currentPage = 1
		const newEmbeds: MessageEmbedOptions[] = []

		let pages = 0
		for (const embed of embeds) {
			pages += 1
			embed.footer = { text: `Page ${pages} of ${length}` }
			newEmbeds.push(embed)
		}

		const buttonRow = new MessageActionRow().addComponents([
			new MessageButton().setLabel('back all').setCustomId('pageBackAll').setStyle('PRIMARY'),
			new MessageButton().setLabel('back 1').setCustomId('pageBackOne').setStyle('PRIMARY'),
			new MessageButton().setLabel('forwards 1').setCustomId('pageForwardsOne').setStyle('PRIMARY'),
			new MessageButton().setLabel('forwards all').setCustomId('pageForwardsAll').setStyle('PRIMARY'),
		])
		await this.interaction.reply({ embeds: [newEmbeds[0]], components: [buttonRow] })

		const interactionCollector = this.channel?.createMessageComponentCollector({ time: 60000 })

		interactionCollector?.on('collect', async (button) => {
			if (!button.isButton()) return
			if (button.user.id != this.author.id) return await button.deferUpdate()

			switch (button.customId) {
				case 'pageBackAll': {
					currentPage = 1
					await button.deferUpdate()
					await this.interaction.editReply({ embeds: [newEmbeds[0]] })
					break
				}
				case 'pageBackOne': {
					if (currentPage === 1) {
						await button.deferUpdate()
						break
					}
					currentPage -= 1
					await button.deferUpdate()
					await this.interaction.editReply({ embeds: [newEmbeds[currentPage - 1]] })
					break
				}
				case 'pageForwardsOne': {
					if (currentPage === pages) currentPage = pages
					else currentPage += 1
					await button.deferUpdate()
					await this.interaction.editReply({ embeds: [newEmbeds[currentPage - 1]] })
					break
				}
				case 'pageForwardsAll': {
					currentPage = pages - 1
					await button.deferUpdate()
					await this.interaction.editReply({ embeds: [newEmbeds[pages - 1]] })
					break
				}
			}
		})
		interactionCollector?.once('end', async () => {
			const buttonRowDisabled = new MessageActionRow().addComponents([
				new MessageButton().setLabel('back all').setCustomId('pageBackAll').setStyle('PRIMARY').setDisabled(true),
				new MessageButton().setLabel('back 1').setCustomId('pageBackOne').setStyle('PRIMARY').setDisabled(true),
				new MessageButton().setLabel('forwards 1').setCustomId('pageForwardsOne').setStyle('PRIMARY').setDisabled(true),
				new MessageButton().setLabel('forwards all').setCustomId('pageForwardsAll').setStyle('PRIMARY').setDisabled(true),
			])
			const interaction = await this.interaction.fetchReply()
			await this.interaction.editReply({ embeds: interaction.embeds, components: [buttonRowDisabled] })
		})
	}
}
