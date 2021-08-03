import { DMChannel, Message, NewsChannel, TextChannel, ThreadChannel } from "discord.js"
import BotClient from "@extensions/BotClient"
import client from "@src/index"

export class FancyMessage extends Message {
	declare client: BotClient
    lowerCaseContent: string

	public constructor(client: BotClient, options: any, channel: TextChannel | DMChannel | NewsChannel | ThreadChannel) {
        //console.log(options)
        super(client, options, channel)
        this.lowerCaseContent = options.content.toLowerCase()
	}
}