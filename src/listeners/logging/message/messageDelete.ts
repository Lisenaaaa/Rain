import { ApplyOptions } from '@sapphire/decorators'
import { Listener, ListenerOptions } from '@sapphire/framework'
import { Message, MessageEmbed } from 'discord.js'

@ApplyOptions<ListenerOptions>({
	once: false,
	event: 'messageDelete',
})
export class MessageDeleteListener extends Listener {
	async run(message: Message) {
		if (message.guild === null) {
			return
		}

		const embed = new MessageEmbed({
			title: 'Message Deleted',
			url: message.url,
			fields: [
				{ name: 'Author', value: `${message.author.tag} (\`${message.author.id}\`)` },
				{ name: 'Channel', value: message.channel.toString() },
				// { name: 'Content', value: message.content },
				// { name: 'Attachments', value: message.attachments.map((a) => a.proxyURL).join(', ') },
			],
			timestamp: `${this.container.utils.now('milliseconds')}`,
		})
		if (message.content) {
			embed.addFields({ name: 'Content', value: message.content })
		}
		if (message.attachments.size != 0) {
			embed.addFields([{ name: 'Attachments', value: message.attachments.map((a) => `[${a.name}](${a.proxyURL})`).join(', ') }])
		}
		await this.container.guilds.log(message.guild, 'message', embed)
	}
}
