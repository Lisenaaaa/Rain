import { DMChannel, Message, NewsChannel, TextChannel, ThreadChannel, User } from "discord.js"
import BotClient from "@extensions/BotClient"
import client from "@src/index"
import { FancyGuild } from "./Guild"

export class FancyUser extends User {
	declare client: BotClient
    public declare timestamp: number

	public constructor(client: BotClient, options: any) {
        super(client, options)
        this.timestamp = Math.round(this.createdTimestamp / 1000)
	}
}