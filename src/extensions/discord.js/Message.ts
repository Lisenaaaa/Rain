import { Message } from 'discord.js'
import BotClient from '@extensions/RainClient'
import { RawMessageData } from 'discord.js/typings/rawDataTypes'

export class RainMessage extends Message {
	declare client: BotClient
	lowerCaseContent: string

	public constructor(client: BotClient, options: RawMessageData) {
		super(client, options)
		this.lowerCaseContent = options.content.toLowerCase()
	}
}
