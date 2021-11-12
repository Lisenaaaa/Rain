import { container } from '@sapphire/pieces'
import { Guild } from 'discord.js'
import { guildCommandSettings, perms } from '../../types/misc'
import { GuildDatabase } from '../../types/database'

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
		const g = await this.database(guild)
		const allCommands = Handler.getAllCommands()
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

			const permissions = Handler.getCommand(c)?.defaultPerms

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
	}
}

container.guilds = new Guilds()