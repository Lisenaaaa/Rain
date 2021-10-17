import BotClient from '@extensions/RainClient'
import database from '@functions/database'
import { perms } from '@src/types/misc'
import { Guild, Snowflake } from 'discord.js'
import { RawGuildData } from 'discord.js/typings/rawDataTypes'

export class RainGuild extends Guild {
	declare client: BotClient

	public constructor(client: BotClient, options: RawGuildData) {
		super(client, options)
	}

	async database(query?: string): Promise<any> { // eslint-disable-line @typescript-eslint/no-explicit-any
		let db = await database.readGuild(this.id)
		if (db === undefined) {
			await database.addGuild(this.id)
			db = await database.readGuild(this.id)
		}

		if (query) {
			const queryArray = query.split('.')
			let dbObject = db
			queryArray.forEach((query) => {
				//@ts-ignore ok typescript
				dbObject = dbObject?.[query as keyof typeof dbObject]
			})
	
			return dbObject
		}
		else return db
	}

	async editStaffRole(position: perms, newRole: Snowflake | null) {
		try {
			return await database.editGuild(this.id, `guildSettings.staffRoles.${position}`, newRole)
		} catch (error) {
			this.client.utils.error(error, ' guild role editing')
			return false
		}
	}

	async setChannelPerms(channel: Snowflake, perms: perms) {
		const currentLockedChannels = (await this.database())?.guildSettings.lockedChannels[perms]
		if (currentLockedChannels?.includes(channel)) return true

		currentLockedChannels?.push(channel)

		return await database.editGuild(this.id, `guildSettings.lockedChannels.${perms}`, currentLockedChannels)
	}

	async removeChannelPerms(channel: Snowflake, perms: perms) {
		const currentLockedChannels = (await this.database())?.guildSettings.lockedChannels[perms]
		const newLockedChannels = currentLockedChannels?.filter((c: Snowflake) => c != channel)

		return await database.editGuild(this.id, `guildSettings.lockedChannels.${perms}`, newLockedChannels)
	}

	async setLogChannel(type: 'message' | 'member' | 'moderation' | 'action', channel: Snowflake) {
		return await database.editGuild(this.id, `guildSettings.loggingChannels.${type}`, channel)
	}

	async resetLogChannel(type: 'message' | 'member' | 'moderation' | 'action') {
		return await database.editGuild(this.id, `guildSettings.loggingChannels.${type}`, null)
	}
}
