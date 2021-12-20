import { container } from '@sapphire/pieces'
import { TextChannel } from 'discord.js'
import { perms } from 'src/types/misc'

export default class Channels {
	async isLocked(channel: TextChannel): Promise<boolean> {
		try {
			if (container.cache.guilds.check(channel.guild.id) === undefined) {
				await container.database.guilds.add(channel.guild.id)
			}

			const channels = container.cache.guilds.get(channel.guild.id)?.guildSettings.lockedChannels

			if (channels?.owner.includes(channel.id)) return true
			if (channels?.admin.includes(channel.id)) return true
			if (channels?.srMod.includes(channel.id)) return true
			if (channels?.moderator.includes(channel.id)) return true
			if (channels?.helper.includes(channel.id)) return true
			if (channels?.trialHelper.includes(channel.id)) return true

			return false
		} catch (err) {
			await container.utils.error(err, {
				type: 'database',
				data: { note: 'Failed to get if a channel is locked to a specific role' },
			})
			return false
		}
	}

	async getRestrictedPerms(channel: TextChannel): Promise<perms | boolean> {
		try {
			if (container.cache.guilds.check(channel.guild.id) === undefined) {
				await container.database.guilds.add(channel.guild.id)
			}

			const channels = container.cache.guilds.get(channel.guild.id)?.guildSettings.lockedChannels
			
			if (channels?.owner.includes(channel.id)) return 'owner'
			else if (channels?.admin.includes(channel.id)) return 'admin'
			else if (channels?.srMod.includes(channel.id)) return 'srMod'
			else if (channels?.moderator.includes(channel.id)) return 'moderator'
			else if (channels?.helper.includes(channel.id)) return 'helper'
			else if (channels?.trialHelper.includes(channel.id)) return 'trialHelper'
			else return 'none'
		} catch (err) {
			await container.utils.error(err, {
				type: 'database',
				data: { note: 'Failed to get if a channel is locked to a specific role' },
			})
			return false
		}
	}
}
