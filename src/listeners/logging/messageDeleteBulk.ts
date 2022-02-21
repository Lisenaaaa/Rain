import { ApplyOptions } from '@sapphire/decorators'
import { Listener, ListenerOptions } from '@sapphire/framework'
import { Collection, Guild, Message, MessageEmbed, Snowflake } from 'discord.js'

@ApplyOptions<ListenerOptions>({
	once: false,
	event: 'messageDeleteBulk',
})
export class MessageDeleteListener extends Listener {
	async run(messages: Collection<Snowflake, Message>) {
		await this.container.guilds.log(messages.first()?.guild as Guild, 'message', new MessageEmbed({ description: "a bunch of messages were deleted but i didn't finish logging for that yet" }))
	}
}
