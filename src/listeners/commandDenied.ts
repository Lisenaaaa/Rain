import { ApplyOptions } from '@sapphire/decorators'
import { CommandDeniedPayload, Listener, ListenerOptions, PreconditionError } from '@sapphire/framework'

@ApplyOptions<ListenerOptions>({
	event: 'commandDenied',
})
export class CommandDeniedListener extends Listener {
	public async run(error: PreconditionError, payload: CommandDeniedPayload) {
		await payload.message.reply(error.message)
	}
}
