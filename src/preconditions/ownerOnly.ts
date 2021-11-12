import { Precondition } from '@sapphire/framework'
import { Message } from 'discord.js'
import users from '../functions/users'

export class OwnerOnlyPrecondition extends Precondition {
	public async run(message: Message) {
		return users.isOwner(message.author)
			? this.ok()
			: this.error({
					identifier: 'ownerOnly',
					message: 'This command can only be used by my developers.',
			})
	}
}

declare module '@sapphire/framework' {
	interface Preconditions {
		ownerOnly: never
	}
}
