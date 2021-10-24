import RainClient from '@extensions/RainClient'
import { InteractionReplyOptions, Message, ReplyMessageOptions } from 'discord.js'
import { RawMessageData } from 'discord.js/typings/rawDataTypes'

export class DRainMessage extends Message {
	declare client: RainClient
	lowerCaseContent: string

	public constructor(client: RainClient, options: RawMessageData) {
		super(client, options)
		this.lowerCaseContent = options.content.toLowerCase()
	}

	async send(content: ReplyMessageOptions | InteractionReplyOptions, data: { reply: boolean } = { reply: true }) {
		return data.reply ? await this.reply(content) : await this.channel.send(content)
	}

	async editReply(content: InteractionReplyOptions) {
		//@ts-ignore
		return this.interaction?.editReply(content)
	}
}
