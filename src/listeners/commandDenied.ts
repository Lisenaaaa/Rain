import { ApplyOptions } from '@sapphire/decorators'
import { MessageCommandDeniedPayload, Listener, ListenerOptions, PreconditionError, ChatInputCommandDeniedPayload } from '@sapphire/framework'

@ApplyOptions<ListenerOptions>({
	event: 'messageCommandDenied',
})
export class Message extends Listener {
	public async run(error: PreconditionError, payload: MessageCommandDeniedPayload) {
		await payload.message.reply(error.message)
	}
}

@ApplyOptions<ListenerOptions>({
	event: 'chatInputCommandDenied',
})
export class CommandDeniedListener extends Listener {
	public async run(error: PreconditionError, payload: ChatInputCommandDeniedPayload) {
		await payload.interaction.reply(error.message)
	}
}
