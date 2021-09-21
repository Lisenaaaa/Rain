import { Guild, Snowflake } from 'discord.js'
import BotClient from '@extensions/RainClient'
import database from '@functions/database'
import { RawGuildData } from 'discord.js/typings/rawDataTypes'
import { perms } from '@src/types/misc'

export class RainGuild extends Guild {
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

	async editStaffRole(position: perms, newRole: Snowflake) {
		try {
			return await database.editGuild(this.id, `guildSettings.staffRoles.${position}`, newRole)
		} catch (error) {
			await this.client.utils.error(error, ' guild role editing')
			return false
		}
	}

	async restrictChannel(channel: Snowflake, perms: perms) {
		const currentLockedChannels = (await this.database())?.guildSettings.lockedChannels[perms]

		currentLockedChannels?.push(channel)

		return await database.editGuild(this.id, `guildSettings.lockedChannels.${perms}`, currentLockedChannels)
	}

	async unrestrictChannel(channel: Snowflake, perms: perms) {
		const currentLockedChannels = (await this.database())?.guildSettings.lockedChannels[perms]

		const newLockedChannels = currentLockedChannels?.filter(c => c != channel)

		return await database.editGuild(this.id, `guildSettings.lockedChannels.${perms}`, newLockedChannels)
	}

	async setLogChannel(type: 'message'|'member'|'moderation'|'action', channel: Snowflake) {
		return await database.editGuild(this.id, `guildSettings.loggingChannels.${type}`, channel)
	}

	async resetLogChannel(type: 'message'|'member'|'moderation'|'action') {
		return await database.editGuild(this.id, `guildSettings.loggingChannels.${type}`, null)
	}
}
