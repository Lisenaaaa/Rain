import { container } from '@sapphire/pieces'
import { TextChannel } from 'discord.js'
import { Perms } from 'src/types/misc'

export default class Channels {
	async isLocked(channel: TextChannel): Promise<boolean> {
		const db = await container.database.guilds.findByPk(channel.guildId)
		if (!db) {
			throw new Error(`Couldn't find the database for guild ${channel.guildId}`)
		}

		const channels = {
			owner: db.ownerOnlyChannels,
			admin: db.adminOnlyChannels,
			srMod: db.srModOnlyChannels,
			mod: db.modOnlyChannels,
			helper: db.helperOnlyChannels,
			trialHelper: db.trialHelperOnlyChannels,
		}

		for (const c in channels) {
			if (c.includes(channel.id)) return true
		}

		return false
	}

	async getRestrictedPerms(channel: TextChannel): Promise<Perms | false> {
		const db = await container.database.guilds.findByPk(channel.guildId)
		if (!db) {
			throw new Error(`Couldn't find the database for guild ${channel.guildId}`)
		}

		let perms: Perms = 'none'

		const channels = {
			owner: db.ownerOnlyChannels,
			admin: db.adminOnlyChannels,
			srMod: db.srModOnlyChannels,
			mod: db.modOnlyChannels,
			helper: db.helperOnlyChannels,
			trialHelper: db.trialHelperOnlyChannels,
		}

		for (const perm in channels) {
			if (channels[perm as keyof typeof channels].includes(channel.id)) {
				perms = perm as Perms
			}
		}

		return perms ?? false
	}
}
