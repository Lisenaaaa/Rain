import { Precondition } from '@sapphire/framework'
import { Message } from 'discord.js'

export class GuildOnlyPrecondition extends Precondition {
	public async run(message: Message) {
		return message.guild
			? this.ok()
			: this.error({
					identifier: 'guildOnly',
					message: 'This command can only be rain while in a guild.',
			})
	}
}

declare module '@sapphire/framework' {
	interface Preconditions {
		guildOnly: never
	}
}
