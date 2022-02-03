import { container } from '@sapphire/pieces'
import { BanOptions, Channel, Guild, Snowflake, TextChannel, UserResolvable } from 'discord.js'
import { GuildCommandSettings, Perms, StaffPerms } from '../../types/misc'
import { DatabaseMember, GuildDatabase } from '../../types/database'

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

			allGuildCommands.forEach((c: GuildCommandSettings) => {
				guildCommandsArray.push(c.id)
			})

			allGuildCommands.forEach((guildCommand: GuildCommandSettings) => {
				if (!allCommands.includes(guildCommand.id)) {
					allGuildCommands = allGuildCommands.filter((c: GuildCommandSettings) => c.id != guildCommand.id)
					container.logger.debug(`Removed ${guildCommand.id} from ${g.guildID}'s database entry`)
				}
			})

			allCommands.forEach((c: string) => {
				if (allGuildCommands.find((cmd: GuildCommandSettings) => cmd.id === c)) return

				const permissions = container.stores.get('commands').get(c)?.options.defaultPermissions

				const command = {
					id: c,
					enabled: true,
					requiredPerms: permissions as Perms,
					lockedChannels: [],
				}

				g.commandSettings.push(command)
				container.logger.debug(`Added ${command.id} to ${g.guildID}'s database entry`)
			})

			await container.database.guilds.edit(g.guildID, 'commandSettings', allGuildCommands)

			return true
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

	async setChannelPerms(guild: Guild, channel: Snowflake | Channel, perms: Perms) {
		const id = channel instanceof Channel ? channel.id : channel

		if (container.cache.guilds.check(guild.id) === undefined) {
			await container.database.guilds.add(guild.id)
		}
		const currentLockedChannels = container.cache.guilds.get(guild.id)?.guildSettings.lockedChannels[perms as StaffPerms]

		// const currentLockedChannels = (await this.database(guild))?.guildSettings.lockedChannels[perms]
		if (currentLockedChannels?.includes(id)) return true

		currentLockedChannels?.push(id)

		return await container.database.guilds.edit(guild.id, `guildSettings.lockedChannels.${perms}`, currentLockedChannels)
	}

	async removeChannelPerms(guild: Guild, channel: Snowflake, perms: Perms) {
		if (container.cache.guilds.check(guild.id) === undefined) {
			await container.database.guilds.add(guild.id)
		}
		const currentLockedChannels = container.cache.guilds.get(guild.id)?.guildSettings.lockedChannels[perms as StaffPerms]
		const newLockedChannels = currentLockedChannels?.filter((c: Snowflake) => c != channel)

		return await container.database.guilds.edit(guild.id, `guildSettings.lockedChannels.${perms}`, newLockedChannels)
	}

	async clearChannelPerms(channel: TextChannel) {
		const currentPerms = await container.channels.getRestrictedPerms(channel)
		if (!currentPerms) {
			return false
		}

		if (currentPerms === 'none') return true

		return await this.removeChannelPerms(channel.guild, channel.id, currentPerms)
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

	async unban(guild: Guild, user: UserResolvable, reason?: string) {
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

		const logs = container.cache.guilds.get(guild.id)?.members as DatabaseMember[]
		const memberLogs = logs.find((m: DatabaseMember) => m.id === id)

		if (memberLogs === undefined) {
			const newModlogs: DatabaseMember = {
				id: id,
				modlogs: [],
				muted: { status: false, expires: null },
				banned: { expires: null },
			}
			logs.push(newModlogs)
			const edited = await container.database.guilds.edit(guild.id, 'members', logs)
			if (edited === false) return edited

			//@ts-ignore
			newModlogs[query] = newValue
			const edited2 = await container.database.guilds.edit(guild.id, `members`, logs)
			return edited2
		}

		//@ts-ignore
		memberLogs[query] = newValue
		const edited = await container.database.guilds.edit(guild.id, `members`, logs)
		return edited
	}

	async hasStaffRoles(guild: Guild) {
		if (container.cache.guilds.check(guild.id) === undefined) {
			await container.database.guilds.add(guild.id)
		}
		const db = (container.cache.guilds.get(guild.id) as GuildDatabase).guildSettings.staffRoles

		if (db.owner === null && db.admin === null && db.srMod === null && db.moderator === null && db.helper === null && db.trialHelper === null) return false
		else return true
	}

	async setCommandPermissions(guild: Guild, command: string, perms: Perms) {
		//if (!Handler.getAllCommands().includes(command)) throw new Error("I can't edit a command that doesn't exist, or isn't valid.")

		if (container.cache.guilds.check(guild.id) === undefined) {
			await container.database.guilds.add(guild.id)
		}
		const commands = container.cache.guilds.get(guild.id)?.commandSettings as GuildCommandSettings[]
		const cmd = commands.find((c: GuildCommandSettings) => c.id === command) as GuildCommandSettings

		cmd.requiredPerms = perms

		return await container.database.guilds.edit(guild.id, 'commandSettings', commands)
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
		if (!container.cache.guilds.check(guild.id)) {
			await container.database.guilds.add(guild.id)
		}

		return container.cache.guilds.get(guild.id)?.commandSettings
	}
}
