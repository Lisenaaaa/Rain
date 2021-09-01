import { Guild } from 'discord.js'
import BotClient from '@extensions/BotClient'
import database from '@functions/database'

export class FancyGuild extends Guild {
	declare client: BotClient

	public constructor(client: BotClient, options: any) {
		//console.log(options)
		super(client, options)
		//this.database = database.readGuild(options.id)
	}

	public async database() {
		console.log('hi')
		return await database.readGuild(this.id)
	}
}
