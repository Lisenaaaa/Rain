import BotClient from '@extensions/RainClient'
import { AkairoMessage } from 'discord-akairo'
import { CommandInteraction, InteractionReplyOptions, ReplyMessageOptions } from 'discord.js'

export class RainMessage extends AkairoMessage {
	declare client: BotClient

	public constructor(client: BotClient, options: CommandInteraction) {
		super(client, options)
	}

	async send(content: string | ReplyMessageOptions | InteractionReplyOptions, data: { reply: boolean } = { reply: true }) {
		return data.reply ? this.interaction.reply(content) : await this.channel?.send(content)
	}

	test() {
		console.log('sex')
	}
}
