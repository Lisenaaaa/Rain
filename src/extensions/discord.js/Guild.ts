import { Guild, Snowflake } from 'discord.js'
import BotClient from '@extensions/BotClient'
import database from '@functions/database'
import { RawGuildData } from 'discord.js/typings/rawDataTypes'

export class FancyGuild extends Guild {
	declare client: BotClient

	public constructor(client: BotClient, options: RawGuildData) {
		super(client, options)
	}

	async database() {
		let db = await database.readGuild(this.id)
		if (db === undefined) {
			await database.addGuild(this.id)
			db = await database.readGuild(this.id)
			return db
		} else return db
	}

	async editStaffRole(position: 'owner' | 'admin' | 'srMod' | 'moderator' | 'helper' | 'trialHelper', newRole: Snowflake) {
		try {
			return await database.editSpecificGuildInDB(this.id, `guildSettings.staffRoles.${position}`, newRole)
		} catch (error) {
			await this.client.utils.error(error, ' guild role editing')
			return false
		}
	}

	
}
