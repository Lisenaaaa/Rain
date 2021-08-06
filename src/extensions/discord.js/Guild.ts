import { DMChannel, Guild, Message, NewsChannel, TextChannel, ThreadChannel } from "discord.js"
import BotClient from "@extensions/BotClient"
import client from "@src/index"
import database from "@functions/database"

export class FancyGuild extends Guild {
	declare client: BotClient

	public constructor(client: BotClient, options: any) {
        //console.log(options)
        super(client, options)
        //this.database = database.readGuild(options.id)
	}

    public async database() {
        return await database.readGuild(this.id)
    }
}