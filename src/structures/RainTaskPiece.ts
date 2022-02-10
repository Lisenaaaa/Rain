import { Awaitable, Piece, PieceContext, PieceOptions } from '@sapphire/framework'

export class RainTask extends Piece {
	constructor(context: PieceContext, options: RainTaskOptions) {
		super(context, options)

		this.delay = options.delay
		this.runOnStart = options.runOnStart ?? false
	}

	public delay: number
	public runOnStart: boolean

	public run?(): Awaitable<unknown>
}

export type RainTaskOptions = PieceOptions & {
	delay: number
	runOnStart?: boolean
}
