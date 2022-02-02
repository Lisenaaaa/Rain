import { ApplyOptions } from '@sapphire/decorators'
import { Listener, ListenerOptions } from '@sapphire/framework'
import { Message } from 'discord.js'

@ApplyOptions<ListenerOptions>({
	once: false,
	event: 'messageCreate',
})
export class MemberAddListener extends Listener {
	//@ts-ignore
	private message: Message

	async run(message: Message) {
		this.message = message

		await this.yellAtDiscord()
	}

	async yellAtDiscord() {
		if (this.message.author.discriminator === '0000' && this.message.channel.type != 'DM') {
			if (this.container.utils.random(10) != 10) return

			try {
				// message from KAI#1028 on https://optifine.net/discord - https://canary.discord.com/channels/423430686880301056/426005631997181963/938564033030815874
				await this.message.reply('I AQHTEW YOU IU HATE YOU DISCOR D YOU SUCK EW I HATE OYU YOU SUCK DISCORD')
			} catch (err) {
				return
			}
		}
	}
}
