import RainClient from '@extensions/RainClient'
import { guildCommandSettings, perms } from '@src/types/misc'
import { Command, CommandOptions } from 'discord-akairo'
import { PermissionResolvable, Snowflake } from 'discord.js'
import { RainGuild } from './discord.js/Guild'

export class RainCommand extends Command {
	declare client: RainClient
	discordPerms: PermissionResolvable[]
	ephemeralWhenNoPerms: boolean
	defaultPerms: perms
	rainPerms: PermissionResolvable[]

	public constructor(id: string, options: RainCommandOptions) {
		super(id, options)
		this.discordPerms = options.discordPerms as PermissionResolvable[]
		this.ephemeralWhenNoPerms = options.ephemeralWhenNoPerms as boolean
		this.defaultPerms = options.defaultPerms as perms
		this.rainPerms = options.rainPerms as PermissionResolvable[]
	}

	async enabled(guildID: Snowflake): Promise<boolean> {
		const db = await this.client.database.readGuild(guildID)

		if (this.ownerOnly) return true
		return db?.commandSettings.find((c) => c.id == this.id)?.enabled as boolean
	}

	async enabledGlobally() {
		if (this.ownerOnly) return true
		return (await this.client.database.getCommand(this.id))?.enabled
	}

	async getPerms(guildID: Snowflake): Promise<perms | 'none'> {
		if (this.ownerOnly) return 'none'
		const db = (await (this.client.guilds.cache.get(guildID) as RainGuild).database('commandSettings')) as guildCommandSettings[]
		const command = db.find((c) => c.id === this.id)

		//@ts-ignore this literally cannot not work in the one place i'm going to be using it
		return command?.lockedRoles
	}
}

interface RainCommandOptions extends CommandOptions {
	description?: string
	discordPerms: PermissionResolvable[]
	ephemeralWhenNoPerms?: boolean
	defaultPerms: perms | 'none'
	rainPerms: PermissionResolvable[]
}
