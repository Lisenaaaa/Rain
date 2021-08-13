import { Command, CommandOptions } from 'discord-akairo'
import { PermissionResolvable } from 'discord.js'
import BotClient from '@extensions/BotClient'

export class BotCommand extends Command {
	declare client: BotClient
	usage: string
	discordPerms: PermissionResolvable[]

	public constructor(id: string, options: BotCommandOptions) {
		super(id, options)
		this.usage = options.usage!
		this.discordPerms = options.discordPerms!
	}
}

interface BotCommandOptions extends CommandOptions {
	description?: string
	usage?: string
	discordPerms?: Array<PermissionResolvable>
}
