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

		if (channels.owner.includes(channel.id)) return true
		if (channels.admin.includes(channel.id)) return true
		if (channels.srMod.includes(channel.id)) return true
		if (channels.mod.includes(channel.id)) return true
		if (channels.helper.includes(channel.id)) return true
		if (channels.trialHelper.includes(channel.id)) return true

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
		const db = await container.database.guilds.findByPk(channel.guildId)
		if (!db) {
			throw new Error(`Couldn't find the database for guild ${channel.guildId}`)
		}

		const locked = await this.isLocked(channel)
		const perms = await this.getRestrictedPerms(channel)
		if (perms === false) return false

		// if it is locked, clear the old perms
		if (locked) {
			switch (perms) {
				case 'owner': {
					await container.database.guilds.update(
						{ ownerOnlyChannels: (await container.database.guilds.findByPk(channel.guildId))?.ownerOnlyChannels.filter((c) => c !== channel.id) },
						{ where: { id: channel.guildId } }
					)
					break
				}
				case 'admin': {
					await container.database.guilds.update(
						{ adminOnlyChannels: (await container.database.guilds.findByPk(channel.guildId))?.adminOnlyChannels.filter((c) => c !== channel.id) },
						{ where: { id: channel.guildId } }
					)
					break
				}
				case 'srMod': {
					await container.database.guilds.update(
						{ srModOnlyChannels: (await container.database.guilds.findByPk(channel.guildId))?.srModOnlyChannels.filter((c) => c !== channel.id) },
						{ where: { id: channel.guildId } }
					)
					break
				}
				case 'moderator': {
					await container.database.guilds.update(
						{ modOnlyChannels: (await container.database.guilds.findByPk(channel.guildId))?.modOnlyChannels.filter((c) => c !== channel.id) },
						{ where: { id: channel.guildId } }
					)
					break
				}
				case 'helper': {
					await container.database.guilds.update(
						{ helperOnlyChannels: (await container.database.guilds.findByPk(channel.guildId))?.helperOnlyChannels.filter((c) => c !== channel.id) },
						{ where: { id: channel.guildId } }
					)
					break
				}
				case 'trialHelper': {
					await container.database.guilds.update(
						{ trialHelperOnlyChannels: (await container.database.guilds.findByPk(channel.guildId))?.trialHelperOnlyChannels.filter((c) => c !== channel.id) },
						{ where: { id: channel.guildId } }
					)
					break
				}
			}
		}

		// set new perms
		switch (perm) {
			case 'owner': {
				const array = (await container.database.guilds.findByPk(channel.guildId))?.ownerOnlyChannels
				array?.push(channel.id)
				await container.database.guilds.update({ ownerOnlyChannels: array }, { where: { id: channel.guildId } })
				break
			}
			case 'admin': {
				const array = (await container.database.guilds.findByPk(channel.guildId))?.adminOnlyChannels
				array?.push(channel.id)
				await container.database.guilds.update({ adminOnlyChannels: array }, { where: { id: channel.guildId } })
				break
			}
			case 'srMod': {
				const array = (await container.database.guilds.findByPk(channel.guildId))?.srModOnlyChannels
				array?.push(channel.id)
				await container.database.guilds.update({ srModOnlyChannels: array }, { where: { id: channel.guildId } })
				break
			}
			case 'moderator': {
				const array = (await container.database.guilds.findByPk(channel.guildId))?.modOnlyChannels
				array?.push(channel.id)
				await container.database.guilds.update({ modOnlyChannels: array }, { where: { id: channel.guildId } })
				break
			}
			case 'helper': {
				const array = (await container.database.guilds.findByPk(channel.guildId))?.helperOnlyChannels
				array?.push(channel.id)
				await container.database.guilds.update({ helperOnlyChannels: array }, { where: { id: channel.guildId } })
				break
			}
			case 'trialHelper': {
				const array = (await container.database.guilds.findByPk(channel.guildId))?.trialHelperOnlyChannels
				array?.push(channel.id)
				await container.database.guilds.update({ trialHelperOnlyChannels: array }, { where: { id: channel.guildId } })
				break
			}

			case 'none':
				break
		}

		return true
	}
}
