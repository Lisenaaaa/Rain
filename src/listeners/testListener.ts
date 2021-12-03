import { ApplyOptions } from '@sapphire/decorators'
import { Listener, ListenerOptions } from '@sapphire/framework'

@ApplyOptions<ListenerOptions>({
	event: 'testEvent',
})
export class CommandDeniedListener extends Listener {
	public async run(thing: string) {
		console.log(thing)
	}
}
