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

		// if (oldMessage.content != newMessage.content && oldMessage.content && newMessage.content) {
		// 	await this.container.guilds.log(
		// 		newMessage.guild,
		// 		'message',
		// 		new MessageEmbed({
		// 			title: 'Message Edited',
		// 			url: newMessage.url,
		// 			fields: [
		// 				{ name: 'Author', value: `${newMessage.author.tag} (\`${newMessage.author.id}\`)` },
		// 				{ name: 'Old Content', value: oldMessage.content },
		// 				{ name: 'New Content', value: newMessage.content },
		// 			],
		// 			footer: { text: newMessage.id },
		// 		})
		// 	)
		// }

		const embed = new MessageEmbed({ title: 'Message Edited', url: newMessage.url, fields: [{ name: 'Author', value: `${newMessage.author.tag} (\`${newMessage.author.id}\`)` }] })

		if (!oldMessage.content && newMessage.content) {
			embed.addField('New Content', newMessage.content)
		}
		if (oldMessage.content && !newMessage.content) {
			embed.addField('Old Content', oldMessage.content)
		}
		if (oldMessage.content && newMessage.content && oldMessage.content !== newMessage.content) {
			embed.addFields([
				{ name: 'Old Content', value: oldMessage.content },
				{ name: 'New Content', value: newMessage.content },
			])
		}

		if (oldMessage.attachments.size === 0 && newMessage.attachments.size !== 0) {
			embed.addField('New Attachments', newMessage.attachments.map((a) => `[${a.name}](${a.proxyURL})`).join(', '))
		}

		if (newMessage.attachments.size === 0 && oldMessage.attachments.size !== 0) {
			embed.addField('New Attachments', oldMessage.attachments.map((a) => `[${a.name}](${a.proxyURL})`).join(', '))
		}

		if (oldMessage.attachments.size !== 0 && newMessage.attachments.size !== 0 && oldMessage.attachments !== newMessage.attachments) {
			embed.addFields([
				{ name: 'Old Attachments', value: oldMessage.attachments.map((a) => `[${a.name}](${a.proxyURL})`).join(', ') },
				{ name: 'New Attachments', value: newMessage.attachments.map((a) => `[${a.name}](${a.proxyURL})`).join(', ') },
			])
		}

		await this.container.guilds.log(newMessage.guild, 'message', embed)
	}
}
