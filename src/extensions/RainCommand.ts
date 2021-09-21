import { Command, CommandOptions } from 'discord-akairo'
import { PermissionResolvable } from 'discord.js'
import RainClient from '@extensions/RainClient'

export class RainCommand extends Command {
	declare client: RainClient
	usage: string
	discordPerms: PermissionResolvable[]

	public constructor(id: string, options: RainCommandOptions) {
		super(id, options)
		this.usage = (options.usage as string)
		this.discordPerms = (options.discordPerms as PermissionResolvable[])
	}
}

interface RainCommandOptions extends CommandOptions {
	description?: string
	usage?: string
	discordPerms?: PermissionResolvable[]
}
