import { ApplyOptions } from '@sapphire/decorators'
import { Listener, ListenerOptions } from '@sapphire/framework'
import { Collection, Message, MessageEmbed, Snowflake } from 'discord.js'

@ApplyOptions<ListenerOptions>({
	once: false,
	event: 'messageDeleteBulk',
})
export class MessageDeleteListener extends Listener {
	async run(messages: Collection<Snowflake, Message>) {
		if (!messages.first()) return
		const guild = messages.first()?.guild
		if (!guild) return

		const msgs = messages.map((msg) => {
			return {
				content: msg.content,
				attachments: msg.attachments.toJSON(),
				embeds: msg.embeds,
				timestamp: `${msg.createdTimestamp} (<t:${Math.floor(msg.createdTimestamp / 1000)}:F>)`,
				author: {
					tag: msg.author.tag,
					id: msg.author.id,
				},
			}
		})

		const haste = await this.container.utils.haste(JSON.stringify(msgs, null, 4))

		await this.container.guilds.log(guild, 'message', new MessageEmbed({ title: 'Bulk Message Deletion', description: `<#${messages.first()?.channelId}>: ${haste}` }))
	}
}
