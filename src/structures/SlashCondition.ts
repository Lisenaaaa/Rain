import { Piece, PieceContext } from '@sapphire/framework'
import type { Awaitable } from '@sapphire/utilities'

export abstract class SlashPrecondition extends Piece {
	constructor(context: PieceContext, options: Options) {
		super(context, options)
	}

	public ok() {
        return true
    }

    public notOk() {
        //thing soon
    }
}

export type Options = {
	name: string
}

/*

preconditions are an array of strings on a slashcommand
when it recieves a slashcommand, check it's preconditions, and run all of them
this.run takes interaction as input, outputs either true (this.ok()) or a custom error object (this.notOk())

*/