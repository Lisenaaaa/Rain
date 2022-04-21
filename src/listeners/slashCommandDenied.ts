import { ApplyOptions } from "@sapphire/decorators";
import { ChatInputCommandDeniedPayload, Listener, ListenerOptions, PreconditionError } from "@sapphire/framework";

@ApplyOptions<ListenerOptions>({
	event: 'chatInputCommandDenied',
})
export class CommandDeniedListener extends Listener {
	public async run(error: PreconditionError, payload: ChatInputCommandDeniedPayload) {
		await payload.interaction.reply(error.message)
	}
}
