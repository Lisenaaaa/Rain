import { Command, CommandOptions } from 'discord-akairo'
import { PermissionResolvable, Snowflake } from 'discord.js'
import RainClient from '@extensions/RainClient'

export class RainCommand extends Command {
	declare client: RainClient
	usage: string
	discordPerms: PermissionResolvable[]
	ephemeralWhenNoPerms: boolean

	public constructor(id: string, options: RainCommandOptions) {
		super(id, options)
		this.usage = options.usage as string
		this.discordPerms = options.discordPerms as PermissionResolvable[]
		this.ephemeralWhenNoPerms = options.ephemeralWhenNoPerms as boolean
	}

	async enabled(guildID: Snowflake): Promise<boolean> {
		const db = await this.client.database.readGuild(guildID)

		return true
	}
}

interface RainCommandOptions extends CommandOptions {
	description?: string
	usage?: string
	discordPerms?: PermissionResolvable[]
	ephemeralWhenNoPerms?: boolean
}
