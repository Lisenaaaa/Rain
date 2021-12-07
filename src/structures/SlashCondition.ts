import { Piece, PieceContext } from '@sapphire/framework'
import { Awaitable, BaseCommandInteraction } from 'discord.js'
import { SlashPreconditionError } from '../types/SlashRelatedTypes'

export abstract class SlashPrecondition extends Piece {
	constructor(context: PieceContext, options: Options) {
		super(context, options)
	}

	public abstract run(
		interaction: BaseCommandInteraction,
		args?: unknown
	): Awaitable<boolean | SlashPreconditionError>

	public ok() {
		return true
	}

	public notOk(message: string): SlashPreconditionError {
		return {
			thingIsError: true,
			message: message,
		}
	}
}

export type Options = {
	name: string
}
