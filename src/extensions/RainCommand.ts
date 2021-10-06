import RainClient from '@extensions/RainClient'
import { perms } from '@src/types/misc'
import { Command, CommandOptions } from 'discord-akairo'
import { PermissionResolvable, Snowflake } from 'discord.js'

export class RainCommand extends Command {
	declare client: RainClient
	discordPerms: PermissionResolvable[]
	ephemeralWhenNoPerms: boolean
	defaultPerms: perms

	public constructor(id: string, options: RainCommandOptions) {
		super(id, options)
		this.discordPerms = options.discordPerms as PermissionResolvable[]
		this.ephemeralWhenNoPerms = options.ephemeralWhenNoPerms as boolean
		this.defaultPerms = options.defaultPerms as perms
	}

	async enabled(guildID: Snowflake): Promise<boolean> {
		const db = await this.client.database.readGuild(guildID)

		return (db?.commandSettings.find(c => c.id == this.id))?.enabled as boolean
	}
}

interface RainCommandOptions extends CommandOptions {
	description?: string
	discordPerms?: PermissionResolvable[]
	ephemeralWhenNoPerms?: boolean
	defaultPerms: perms | 'none'
}
