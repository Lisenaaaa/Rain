import { container } from '@sapphire/pieces'
import { BanOptions, Channel, Guild, UserResolvable } from 'discord.js'
import { GuildAttributes } from '../databases/guild'
import { GuildCommandAttributes } from '../databases/guildCommands'

export default class Guilds {
	async registerCommands(guild: Guild) {
		try {
			if (!(await container.database.guilds.findByPk(guild.id))) {
				await container.database.guilds.create({ id: guild.id })
			}

			const allCommands: string[] = container.utils.getAllCommands()
			let allGuildCommands = await container.database.guildCommands.findAll({ where: { guildId: guild.id } })
			const guildCommandsArray: string[] = []

			allGuildCommands.forEach((c: GuildCommandAttributes) => {
				guildCommandsArray.push(c.commandId)
			})

			allGuildCommands.forEach((guildCommand: GuildCommandAttributes) => {
				if (!allCommands.includes(guildCommand.commandId)) {
					allGuildCommands = allGuildCommands.filter((c: GuildCommandAttributes) => c.commandId != guildCommand.commandId)
					container.logger.debug(`Removed ${guildCommand.commandId} from ${guild.id}'s database entry`)
				}
			})

			allCommands.forEach(async (c: string) => {
				if (allGuildCommands.find((cmd: GuildCommandAttributes) => cmd.commandId === c)) return

				const permissions = container.stores.get('commands').get(c)?.options.defaultPermissions

				await container.database.guildCommands.create({ commandId: c, guildId: guild.id, enabled: true, requiredPerms: permissions ?? 'none' })
				container.logger.debug(`Added ${c} to ${guild.id}'s database entry`)
			})

			return true
		} catch (err) {
			await container.utils.error(err, {
				type: 'database',
				data: { note: "Failed to register a guild's commands" },
			})
		}
	}

	async ban(guild: Guild, user: UserResolvable, options: BanOptions, time?: Date) {
		try {
			const person = await container.client.users.fetch(user)
			await guild.bans.create(user, options)
			if (!(await container.database.guilds.findByPk(guild.id))) {
				await container.database.guilds.create({ id: guild.id })
			}

			await container.database.members.update({ banExpires: time }, { where: { guildId: guild.id, memberId: person.id } })
			return true
		} catch (err) {
			await container.utils.error(err, {
				type: 'database',
				data: { note: 'Something went wrong while banning a member.' },
			})
			return false
		}
	}

	async unban(guild: Guild, user: UserResolvable, reason?: string) {
		try {
			const person = await container.client.users.fetch(user)
			await guild.bans.remove(user, reason)
			if (!(await container.database.guilds.findByPk(guild.id))) {
				await container.database.guilds.create({ id: guild.id })
			}

			await container.database.members.update({ banExpires: null }, { where: { guildId: guild.id, memberId: person.id } })
			return true
		} catch (err) {
			await container.utils.error(err, {
				type: 'database',
				data: { note: 'Something went wrong while unbanning a member.' },
			})
			return false
		}
	}

	async hasStaffRoles(guild: Guild) {
		if (!(await container.database.guilds.findByPk(guild.id))) {
			await container.database.guilds.create({ id: guild.id })
		}

		const db = (await container.database.guilds.findByPk(guild.id)) as GuildAttributes

		if (db.ownerRole === null && db.adminRole === null && db.srModRole === null && db.modRole === null && db.helperRole === null && db.trialHelperRole === null) return false
		else return true
	}

	findChannel(guild: Guild, query: string): Channel | undefined {
		const channels = guild.channels.cache

		let channel
		channel = channels.get(query.replace('<', '').replace('#', '').replace('>', ''))

		if (!channel) {
			channel = channels.find((c) => c.name.toLowerCase() === query.toLowerCase())
		}

		return channel
	}

	async getAllCommands(guild: Guild) {
		if (!(await container.database.guilds.findByPk(guild.id))) {
			await container.database.guilds.create({ id: guild.id })
		}

		return container.database.guildCommands.findAll()
	}
}
