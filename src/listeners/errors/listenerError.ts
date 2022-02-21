import { ApplyOptions } from '@sapphire/decorators'
import { Listener, ListenerErrorPayload, ListenerOptions } from '@sapphire/framework'

@ApplyOptions<ListenerOptions>({
	event: 'listenerError',
})
export class ListenerErrorListener extends Listener {
	public async run(error: Error, payload: ListenerErrorPayload) {
		await this.container.utils.error(error, {
			type: 'listener',
			data: {
				note: payload.piece.name,
			},
		})
	}
}
