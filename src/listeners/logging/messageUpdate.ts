import { ApplyOptions } from '@sapphire/decorators'
import { Listener, ListenerOptions } from '@sapphire/framework'
import { Message, MessageEmbed } from 'discord.js'

@ApplyOptions<ListenerOptions>({
	once: false,
	event: 'messageUpdate',
})
export class MessageUpdateListener extends Listener {
	async run(oldMessage: Message, newMessage: Message) {
		if (newMessage.guild === null) {
			return
		}

		if (oldMessage.content != newMessage.content && oldMessage.content && newMessage.content) {
			await this.container.guilds.log(
				newMessage.guild,
				'message',
				new MessageEmbed({
					title: 'Message Edited',
					url: newMessage.url,
					fields: [
						{ name: 'Author', value: `${newMessage.author.tag} (\`${newMessage.author.id}\`)` },
						{ name: 'Old Content', value: oldMessage.content },
						{ name: 'New Content', value: newMessage.content },
					],
					footer: { text: newMessage.id },
				})
			)
		}
	}
}
