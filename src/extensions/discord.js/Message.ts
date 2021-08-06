import { DMChannel, Message, NewsChannel, TextChannel, ThreadChannel } from "discord.js"
import BotClient from "@extensions/BotClient"
import client from "@src/index"
import { FancyGuild } from "./Guild"

export class FancyMessage extends Message {
	declare client: BotClient
    lowerCaseContent: string
    guild: FancyGuild

	public constructor(client: BotClient, options: any) {
        super(client, options)
        this.lowerCaseContent = options.content.toLowerCase()
        //this.guild = this.client.guilds.cache.get(options.guild_id) as FancyGuild
        this.guild = new FancyGuild(client, client.guilds.cache.get(options.guild_id))
	}
}