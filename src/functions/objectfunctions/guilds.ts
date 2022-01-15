import { container } from '@sapphire/pieces'
import { BanOptions, Guild, Snowflake, UserResolvable } from 'discord.js'
import { guildCommandSettings, Perms } from '../../types/misc'
import { databaseMember, GuildDatabase } from '../../types/database'

export default class Guilds {
	async registerCommands(guild: Guild) {
		try {
			if (!container.cache.guilds.check(guild.id)) {
				await container.database.guilds.add(guild.id)
			}
			const g = container.cache.guilds.get(guild.id) as GuildDatabase

			const allCommands: string[] = container.utils.getAllCommands()
			let allGuildCommands = g.commandSettings
			const guildCommandsArray: string[] = []

			allGuildCommands.forEach((c: guildCommandSettings) => {
				guildCommandsArray.push(c.id)
			})

			allGuildCommands.forEach((guildCommand: guildCommandSettings) => {
				if (!allCommands.includes(guildCommand.id)) {
					allGuildCommands = allGuildCommands.filter((c: guildCommandSettings) => c.id != guildCommand.id)
					container.logger.info(`Removed ${guildCommand.id} from ${g.guildID}'s database entry`)
				}
			})

			allCommands.forEach((c: string) => {
				if (allGuildCommands.find((cmd: guildCommandSettings) => cmd.id === c)) return

				const permissions = '' //Handler.getCommand(c)?.defaultPerms

				const command = {
					id: c,
					enabled: true,
					lockedRoles: permissions as Perms,
					lockedChannels: [],
				}

				g.commandSettings.push(command)
				container.logger.info(`Added ${command.id} to ${g.guildID}'s database entry`)
			})

			await container.database.guilds.edit(g.guildID, 'commandSettings', allGuildCommands)
		} catch (err) {
			await container.utils.error(err, {
				type: 'database',
				data: { note: "Failed to register a guild's commands" },
			})
		}
	}

	async editStaffRole(guild: Guild, position: Perms, newRole: Snowflake | null) {
		try {
			return await container.database.guilds.edit(guild.id, `guildSettings.staffRoles.${position}`, newRole)
		} catch (error) {
			container.utils.error(error, {
				type: 'Database',
				data: { note: `Failed to edit a guild's ${position} role.` },
			})
			return false
		}
	}

	async setChannelPerms(guild: Guild, channel: Snowflake, perms: Perms) {
		//@ts-ignore
		if (channel.id) {
			throw new Error("yeah thats not how this works dumbass you need the channel's id")
		}

		if (container.cache.guilds.check(guild.id) === undefined) {
			await container.database.guilds.add(guild.id)
		}
		//@ts-ignore typescript is dumb and stupid
		const currentLockedChannels = container.cache.guilds.get(guild.id)?.guildSettings.lockedChannels[perms]

		// const currentLockedChannels = (await this.database(guild))?.guildSettings.lockedChannels[perms]
		if (currentLockedChannels?.includes(channel)) return true

		currentLockedChannels?.push(channel)

		return await container.database.guilds.edit(guild.id, `guildSettings.lockedChannels.${perms}`, currentLockedChannels)
	}

	async removeChannelPerms(guild: Guild, channel: Snowflake, perms: Perms) {
		if (container.cache.guilds.check(guild.id) === undefined) {
			await container.database.guilds.add(guild.id)
		}
		//@ts-ignore typescript is dumb and stupid
		const currentLockedChannels = container.cache.guilds.get(guild.id)?.guildSettings.lockedChannels[perms]
		const newLockedChannels = currentLockedChannels?.filter((c: Snowflake) => c != channel)

		return await container.database.guilds.edit(guild.id, `guildSettings.lockedChannels.${perms}`, newLockedChannels)
	}

	async setLogChannel(guild: Guild, type: 'message' | 'member' | 'moderation' | 'action', channel: Snowflake) {
		return await container.database.guilds.edit(guild.id, `guildSettings.loggingChannels.${type}`, channel)
	}

	async resetLogChannel(guild: Guild, type: 'message' | 'member' | 'moderation' | 'action') {
		return await container.database.guilds.edit(guild.id, `guildSettings.loggingChannels.${type}`, null)
	}

	async ban(guild: Guild, user: UserResolvable, options: BanOptions, time?: number) {
		try {
			const person = await container.client.users.fetch(user)
			await guild.bans.create(user, options)
			if (container.cache.guilds.check(guild.id) === undefined) {
				await container.database.guilds.add(guild.id)
			}
			return await this.editMemberEntry(guild, person.id, 'banned', {
				expires: time ? time : null,
			})
		} catch (err) {
			await container.utils.error(err, {
				type: 'database',
				data: { note: 'Something went wrong while banning a member.' },
			})
			return false
		}
	}

	async unban(guild: Guild, user: UserResolvable, reason: string) {
		try {
			const person = await container.client.users.fetch(user)
			await guild.bans.remove(user, reason)
			if (container.cache.guilds.check(guild.id) === undefined) {
				await container.database.guilds.add(guild.id)
			}
			return await this.editMemberEntry(guild, person.id, 'banned', { expires: null })
		} catch (err) {
			await container.utils.error(err, {
				type: 'database',
				data: { note: 'Something went wrong while unbanning a member.' },
			})
			return false
		}
	}

	async editMemberEntry(guild: Guild, id: Snowflake, query: 'modlogs' | 'muted' | 'banned', newValue: unknown): Promise<boolean> {
		if (container.cache.guilds.check(guild.id) === undefined) {
			await container.database.guilds.add(guild.id)
		}

		const logs = container.cache.guilds.get(guild.id)?.members as databaseMember[]
		const memberLogs = logs.find((m: databaseMember) => m.id === id)

		if (memberLogs === undefined) {
			const newModlogs: databaseMember = {
				id: id,
				modlogs: [],
				muted: { status: false, expires: null },
				banned: { expires: null },
			}
			const edited = await container.database.guilds.edit(guild.id, 'members', logs.push(newModlogs))
			if (edited === false) return edited

			//@ts-ignore stfu
			newModlogs[query] = newValue
			const edited2 = await container.database.guilds.edit(guild.id, `members`, logs)
			return edited2
		}

		//@ts-ignore stfu
		memberLogs[query] = newValue
		const edited = await container.database.guilds.edit(guild.id, `members`, logs)
		return edited
	}

	async hasStaffRoles(guild: Guild) {
		if (container.cache.guilds.check(guild.id) === undefined) {
			await container.database.guilds.add(guild.id)
		}
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const db = container.cache.guilds.get(guild.id)?.guildSettings.staffRoles as any

		if (db.owner === null && db.admin === null && db.srMod === null && db.moderator === null && db.helper === null && db.trialHelper === null) return false
		else return true
	}

	async setCommandPermissions(guild: Guild, command: string, perms: Perms) {
		//if (!Handler.getAllCommands().includes(command)) throw new Error("I can't edit a command that doesn't exist, or isn't valid.")

		if (container.cache.guilds.check(guild.id) === undefined) {
			await container.database.guilds.add(guild.id)
		}
		const commands = container.cache.guilds.get(guild.id)?.commandSettings as guildCommandSettings[]
		const cmd = commands.find((c: guildCommandSettings) => c.id === command) as guildCommandSettings

		cmd.lockedRoles = perms

		return await container.database.guilds.edit(guild.id, 'commandSettings', commands)
	}

	findChannel(guild: Guild, query: string) {
		const channels = guild.channels.cache

		let channel
		channel = channels.get(query)

		if (!channel) {
			channel = channels.find((c) => c.name.toLowerCase() === query.toLowerCase())
		}

		return channel
	}
}
