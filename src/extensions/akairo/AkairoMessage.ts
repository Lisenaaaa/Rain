import { CommandInteraction, InteractionReplyOptions, ReplyMessageOptions } from 'discord.js'
import BotClient from '@extensions/RainClient'
import { AkairoMessage } from 'discord-akairo'

export class RainMessage extends AkairoMessage {
	declare client: BotClient

	public constructor(client: BotClient, options: CommandInteraction) {
		super(client, options)
	}

	async send(content: string | ReplyMessageOptions | InteractionReplyOptions, data: { reply: boolean } = { reply: true }) {
		return data.reply ? this.interaction.reply(content) : await this.channel?.send(content)
	}
}
