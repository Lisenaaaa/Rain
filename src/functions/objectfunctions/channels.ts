import { GuildTextBasedChannelTypes } from '@sapphire/discord.js-utilities'
import { container } from '@sapphire/pieces'
import { Perms } from 'src/types/misc'

export default class Channels {
	async isLocked(channel: GuildTextBasedChannelTypes): Promise<boolean> {
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

	async getRestrictedPerms(channel: GuildTextBasedChannelTypes): Promise<Perms | false> {
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

	async changePerms(channel: GuildTextBasedChannelTypes, perm: Perms): Promise<boolean> {
		// this is not done, only because it's really fuckin hot in my room rn and i REALLY don't feel like doing a quintillion if statements or switch case blocks
		return false
	}
}
