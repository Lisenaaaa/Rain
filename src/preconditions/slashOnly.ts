import { Precondition } from '@sapphire/framework'

export class GuildOnlyPrecondition extends Precondition {
	public override async messageRun() {
		return this.error({ identifier: 'slashOnly', message: 'Please use the slash version of this command!' })
	}

	public override async chatInputRun() {
		return this.ok()
	}
}

declare module '@sapphire/framework' {
	interface Preconditions {
		slashOnly: never
	}
}
