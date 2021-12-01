import { Piece, PieceContext } from '@sapphire/framework'
import type { Awaitable } from '@sapphire/utilities'
import type {
	ApplicationCommandData,
	ApplicationCommandOptionData,
	CommandInteraction,
	Snowflake,
} from 'discord.js'

export abstract class SlashCommand extends Piece {
	public readonly commandData: Options
	public readonly guildOnly: boolean
	public readonly ownerOnly: boolean
	constructor(context: PieceContext, options: Options) {
		super(context, options)

		this.commandData = {
			name: this.name,
			description: options.description ?? 'No description provided',
			options: options.options ?? [],
			defaultPermission: options.defaultPermission ?? true,
			guilds: options.guilds,
		}

		this.ownerOnly = options.ownerOnly ?? false
		this.guildOnly = options.guildOnly ?? false
	}

	public abstract run(interaction: CommandInteraction, args?: unknown): Awaitable<unknown>
}

export type Options = ApplicationCommandData & {
	description: string
	options?: ApplicationCommandOptionData[]
	defaultPermission?: boolean
	guildOnly?: boolean
	guilds?: Snowflake[]
	ownerOnly?: boolean
}
