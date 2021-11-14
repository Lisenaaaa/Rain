import { container } from '@sapphire/pieces'
import { BanOptions, Guild, Snowflake, UserResolvable } from 'discord.js'
import { guildCommandSettings, perms } from '../../types/misc'
import { databaseMember, GuildDatabase } from '../../types/database'

export default class Guilds {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	async database(guild: Guild, query?: string): Promise<GuildDatabase | any> {
		let db = await container.database.guilds.fetchOne(guild.id)
		if (db === undefined) {
			await container.database.guilds.add(guild.id)
			await this.registerCommands(guild)
			db = await container.database.guilds.fetchOne(guild.id)
		}

		if (query) {
			const queryArray = query.split('.')
			let dbObject = db
			queryArray.forEach((query) => {
				//@ts-ignore ok typescript
				dbObject = dbObject?.[query as keyof typeof dbObject]
			})

			return dbObject
		} else return db as GuildDatabase
	}

	async registerCommands(guild: Guild) {
		try {
			const g = await this.database(guild)
			const allCommands: string[] = container.utils.getAllCommands()
			let allGuildCommands = g.commandSettings
			const guildCommandsArray: string[] = []

			allGuildCommands.forEach((c: guildCommandSettings) => {
				guildCommandsArray.push(c.id)
			})

			allGuildCommands.forEach((guildCommand: guildCommandSettings) => {
				if (!allCommands.includes(guildCommand.id)) {
					allGuildCommands = allGuildCommands.filter(
						(c: guildCommandSettings) => c.id != guildCommand.id
					)
					container.logger.info(
						`Removed ${guildCommand.id} from ${g.guildID}'s database entry`
					)
				}
			})

			allCommands.forEach((c: string) => {
				if (allGuildCommands.find((cmd: guildCommandSettings) => cmd.id === c)) return

				const permissions = '' //Handler.getCommand(c)?.defaultPerms

				const command = {
					id: c,
					enabled: true,
					lockedRoles: permissions as perms,
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

	async editStaffRole(guild: Guild, position: perms, newRole: Snowflake | null) {
		try {
			return await container.database.guilds.edit(
				guild.id,
				`guildSettings.staffRoles.${position}`,
				newRole
			)
		} catch (error) {
			container.utils.error(error, {
				type: 'Database',
				data: { note: `Failed to edit a guild's ${position} role.` },
			})
			return false
		}
	}

	async setChannelPerms(guild: Guild, channel: Snowflake, perms: perms) {
		const currentLockedChannels = (await this.database(guild))?.guildSettings.lockedChannels[
			perms
		]
		if (currentLockedChannels?.includes(channel)) return true

		currentLockedChannels?.push(channel)

		return await container.database.guilds.edit(
			guild.id,
			`guildSettings.lockedChannels.${perms}`,
			currentLockedChannels
		)
	}

	async removeChannelPerms(guild: Guild, channel: Snowflake, perms: perms) {
		const currentLockedChannels = (await this.database(guild))?.guildSettings.lockedChannels[
			perms
		]
		const newLockedChannels = currentLockedChannels?.filter((c: Snowflake) => c != channel)

		return await container.database.guilds.edit(
			guild.id,
			`guildSettings.lockedChannels.${perms}`,
			newLockedChannels
		)
	}

	async setLogChannel(
		guild: Guild,
		type: 'message' | 'member' | 'moderation' | 'action',
		channel: Snowflake
	) {
		return await container.database.guilds.edit(
			guild.id,
			`guildSettings.loggingChannels.${type}`,
			channel
		)
	}

	async resetLogChannel(guild: Guild, type: 'message' | 'member' | 'moderation' | 'action') {
		return await container.database.guilds.edit(
			guild.id,
			`guildSettings.loggingChannels.${type}`,
			null
		)
	}

	async ban(guild: Guild, user: UserResolvable, options: BanOptions, time?: number) {
		try {
			const person = await container.client.users.fetch(user)
			await guild.bans.create(user, options)
			await this.database(guild)
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
			await this.database(guild)
			return await this.editMemberEntry(guild, person.id, 'banned', { expires: null })
		} catch (err) {
			await container.utils.error(err, {
				type: 'database',
				data: { note: 'Something went wrong while unbanning a member.' },
			})
			return false
		}
	}

	async editMemberEntry(
		guild: Guild,
		id: Snowflake,
		query: 'modlogs' | 'muted' | 'banned',
		newValue: unknown
	): Promise<boolean> {
		const logs = await this.database(guild, 'members')
		const memberLogs = logs.find((m: databaseMember) => m.id === id)

		if (memberLogs === undefined) {
			//@ts-ignore what
			const newModlogs: databaseMember = {
				id: id,
				modlogs: [],
				muted: { status: false, expires: null },
				banned: { expires: null },
			}
			const edited = await container.database.guilds.edit(
				guild.id,
				'members',
				(await this.database(guild, 'members')).push(newModlogs)
			)
			if (edited === false) return edited

			//@ts-ignore stfu
			newModlogs[query] = newValue
			const edited2 = await container.database.guilds.edit(guild.id, `members`, logs)
			return edited2
		}

		memberLogs[query] = newValue
		const edited = await container.database.guilds.edit(guild.id, `members`, logs)
		return edited
	}

	async hasStaffRoles(guild: Guild) {
		const db = await this.database(guild, 'guildSettings.staffRoles')

		if (
			db.owner === null &&
			db.admin === null &&
			db.srMod === null &&
			db.moderator === null &&
			db.helper === null &&
			db.trialHelper === null
		)
			return false
		else return true
	}

	async setCommandPermissions(guild: Guild, command: string, perms: perms) {
		//if (!Handler.getAllCommands().includes(command)) throw new Error("I can't edit a command that doesn't exist, or isn't valid.")

		const commands = await this.database(guild, 'commandSettings')
		const cmd = commands.find((c: guildCommandSettings) => c.id === command)

		cmd.lockedRoles = perms

		return await container.database.guilds.edit(guild.id, 'commandSettings', commands)
	}
}
