import { ApplyOptions } from '@sapphire/decorators'
import { MessageCommandDeniedPayload, Listener, ListenerOptions, PreconditionError } from '@sapphire/framework'

@ApplyOptions<ListenerOptions>({
	event: 'messageCommandDenied',
})
export class Message extends Listener {
	public async run(error: PreconditionError, payload: MessageCommandDeniedPayload) {
		await payload.message.reply(error.message)
	}
}

