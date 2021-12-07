import { Piece, PieceContext, PreconditionEntryResolvable } from '@sapphire/framework'
import type { Awaitable } from '@sapphire/utilities'
import type {
	ApplicationCommandData,
	ApplicationCommandOptionData,
	CommandInteraction,
	Snowflake,
} from 'discord.js'

export abstract class SlashCommand extends Piece {
	public readonly commandData: Options
	public readonly ownerOnly: boolean
	public readonly guilds: Snowflake[] | undefined
	public readonly preconditions: PreconditionEntryResolvable[] | undefined
	constructor(context: PieceContext, options: Options) {
		super(context, options)

		this.commandData = {
			name: this.name,
			description: options.description ?? 'No description provided',
			options: options.options ?? [],
			defaultPermission: options.defaultPermission ?? true,
		}

		this.ownerOnly = options.ownerOnly ?? false
		this.guilds = options.guilds ?? undefined
		this.preconditions = options.preconditions
	}

	public abstract run(interaction: CommandInteraction, args?: unknown): Awaitable<unknown>
}

export type Options = ApplicationCommandData & {
	description: string
	options?: ApplicationCommandOptionData[]
	defaultPermission?: boolean
	guilds?: Snowflake[]
	ownerOnly?: boolean
	preconditions?: PreconditionEntryResolvable[]
}
