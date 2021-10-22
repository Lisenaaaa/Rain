import BotClient from '@extensions/RainClient'
import database from '@functions/database'
import Handler from '@functions/handler'
import { databaseMember } from '@src/types/database'
import { guildCommandSettings, perms } from '@src/types/misc'
import chalk from 'chalk'
import { BanOptions, Guild, Snowflake, UserResolvable } from 'discord.js'
import { RawGuildData } from 'discord.js/typings/rawDataTypes'

export class RainGuild extends Guild {
	declare client: BotClient

	public constructor(client: BotClient, options: RawGuildData) {
		super(client, options)
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	async database(query?: string): Promise<any> {
		let db = await database.readGuild(this.id)
		if (db === undefined) {
			await database.addGuild(this.id)
			await this.registerCommands()
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
		} else return db
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

	async registerCommands() {
		const g = await this.database()
		const allCommands = Handler.getAllCommands()
		let allGuildCommands = g.commandSettings
		const guildCommandsArray: string[] = []

		allGuildCommands.forEach((c: guildCommandSettings) => {
			guildCommandsArray.push(c.id)
		})

		allGuildCommands.forEach((guildCommand: guildCommandSettings) => {
			if (!allCommands.includes(guildCommand.id)) {
				allGuildCommands = allGuildCommands.filter((c: guildCommandSettings) => c.id != guildCommand.id)
				console.log(chalk`{red Removed} {magenta ${guildCommand.id}} {red from ${g.guildID}'s database entry}`)
			}
		})

		allCommands.forEach((c) => {
			if (allGuildCommands.find((cmd: guildCommandSettings) => cmd.id === c)) return

			const permissions = Handler.getCommand(c)?.defaultPerms

			const command = { id: c, enabled: true, lockedRoles: permissions as perms, lockedChannels: [] }

			g.commandSettings.push(command)
			console.log(chalk`{blue Added} {magenta ${command.id}} {blue to ${g.guildID}'s database entry}`)
		})

		await database.editGuild(g.guildID, 'commandSettings', allGuildCommands)
	}

	async ban(user: UserResolvable, options: BanOptions, time?: number) {
		try {
			const person = await this.client.users.fetch(user)
			await this.bans.create(user, options)
			await this.database()
			return await this.editMemberEntry(person.id, 'banned', { expires: time ? time : null })
		} catch (err) {
			await this.client.utils.error(err)
			return false
		}
	}

	async editMemberEntry(id: Snowflake, query: 'modlogs' | 'muted' | 'banned', newValue: unknown): Promise<boolean> {
		const logs = await this.database('members')
		const memberLogs = logs.find((m: databaseMember) => m.id === id)

		if (memberLogs === undefined) {
			//@ts-ignore what
			const newModlogs: databaseMember = { id: id, modlogs: [], muted: { status: false, expires: null }, banned: { expires: null } }
			const edited = await database.editGuild(this.id, 'members', newModlogs)
			if (edited === false) return edited

			//@ts-ignore stfu
			newModlogs[query] = newValue
			const edited2 = await database.editGuild(this.id, `members`, logs)
			return edited2
		}

		memberLogs[query] = newValue
		const edited = await database.editGuild(this.id, `members`, logs)
		return edited
	}
}
